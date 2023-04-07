import { getLoggerFor, Logger } from '@digita-ai/handlersjs-logging';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, switchMap, toArray, catchError } from 'rxjs/operators';
import { v4 } from 'uuid';
import { BadRequestHttpError } from '../../errors/bad-request-http-error';
import { HttpHandler } from '../../models/http-handler';
import { HttpHandlerContext } from '../../models/http-handler-context';
import { HttpHandlerRequest } from '../../models/http-handler-request';
import { HttpMethods } from '../../models/http-method';
import { statusCodes } from '../../handlers/error.handler';
import { NodeHttpStreamsHandler } from './node-http-streams.handler';
import { NodeHttpStreams } from './node-http-streams.model';

/**
 * A { NodeHttpStreamsHandler } reading the request stream into a { HttpHandlerRequest },
 * passing it through a { HttpHandler } and writing the resulting { HttpHandlerResponse } to the response stream.
 */
export class NodeHttpRequestResponseHandler implements NodeHttpStreamsHandler {

  /**
   * Creates a { NodeHttpRequestResponseHandler } passing requests through the given handler.
   *
   * @param { HttpHandler } httpHandler - the handler through which to pass incoming requests.
   */
  constructor(
    private httpHandler: HttpHandler,
    private poweredBy = 'handlers.js',
    private hsts?: { maxAge: number; includeSubDomains: boolean },
  ) {

    if (!httpHandler) {

      throw new Error('A HttpHandler must be provided');

    }

  }

  private parseBody(
    logger: Logger,
    body: string,
    contentType?: string,
  ): string | { [key: string]: string } {

    // TODO: parse x-www-form-urlencoded body
    // case 'application/':
    //   return JSON.parse(`{"${decodeURIComponent(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);

    logger.info('Parsing request body', { body, contentType });

    if (contentType?.startsWith('application/json')) {

      try {

        return JSON.parse(body);

      } catch(error: any) {

        throw new BadRequestHttpError(error.message);

      }

    }

    return body;

  }

  private parseResponseBody(
    logger: Logger,
    body: unknown,
    contentType?: string,
  ) {

    // don't log the body if it is a buffer. It results in a long, illegible log.
    logger.info('Parsing response body', { body: body instanceof Buffer ? 'Buffer' : body, contentType });

    if (contentType?.startsWith('application/json')) {

      return typeof body === 'string' || body instanceof Buffer ? body : JSON.stringify(body);

    } else {

      return body;

    }

  }

  /**
   * Reads the requestStream of its NodeHttpStreams pair into a HttpHandlerRequest,
   * creates a HttpHandlerContext from it, passes it through the { HttpHandler },
   * and writes the result to the responseStream.
   *
   * @param { NodeHttpStreams } noteHttpStreams - the incoming set of Node.js HTTP read and write streams
   * @returns an { Observable<void> } for completion detection
   */
  handle(nodeHttpStreams: NodeHttpStreams): Observable<void> {

    // This is where we initialize a logger to be passed through the code
    // via the HttpHandlerContext (no need to call .setLabel() here)
    const logger = getLoggerFor(this);
    // Add a request id to to be logged with every log from here on
    logger.setVariable('requestId', v4());

    if (!nodeHttpStreams) {

      logger.verbose('No node http streams received');

      return throwError(() => new Error('node http streams object cannot be null or undefined.'));

    }

    if (!nodeHttpStreams.requestStream) {

      logger.verbose('No request stream received', nodeHttpStreams);

      return throwError(() => new Error('request stream cannot be null or undefined.'));

    }

    if (!nodeHttpStreams.requestStream.headers) {

      logger.verbose('No request headers received', nodeHttpStreams.requestStream);

      return throwError(() => new Error('headers of the request cannot be null or undefined.'));

    }

    // Add a correlation id to be logged with every log from here on
    const correlationIdHeader = nodeHttpStreams.requestStream.headers['x-correlation-id'];
    logger.setVariable('correlationId', (Array.isArray(correlationIdHeader) ? correlationIdHeader[0] : correlationIdHeader) ?? v4());

    if (!nodeHttpStreams.responseStream) {

      logger.verbose('No response stream received', nodeHttpStreams);

      return throwError(() => new Error('response stream cannot be null or undefined.'));

    }

    const url = nodeHttpStreams.requestStream.url;

    if (!url) {

      logger.verbose('No url received', nodeHttpStreams.requestStream);

      return throwError(() => new Error('url of the request cannot be null or undefined.'));

    }

    const method = Object.values(HttpMethods).find((m) => m === nodeHttpStreams.requestStream.method);

    if (!method) {

      logger.verbose('No method received', nodeHttpStreams.requestStream);

      return throwError(() => new Error('method of the request cannot be null or undefined.'));

    }

    const buffer = new Subject<any>();

    nodeHttpStreams.requestStream.on('data', (chunk) => buffer.next(chunk));
    nodeHttpStreams.requestStream.on('end', () => buffer.complete());

    return buffer.pipe(
      toArray(),
      map((chunks) => Buffer.concat(chunks).toString()),
      map((body) => {

        // Make sure first param doesn't start with multiple slashes
        const urlObject: URL = new URL(url.replace(/^\/+/, '/'), `http://${nodeHttpStreams.requestStream.headers.host}`);

        const httpHandlerRequest: HttpHandlerRequest = {
          url: urlObject,
          method,
          headers: nodeHttpStreams.requestStream.headers as { [key: string]: string },
          ... (body && body !== '') && { body: this.parseBody(logger, body, nodeHttpStreams.requestStream.headers['content-type']) },
        };

        return { request: httpHandlerRequest, logger };

      }),
      switchMap((context: HttpHandlerContext) => {

        logger.info('Handling request: ', context);

        return this.httpHandler.handle(context);

      }),
      catchError((error) => {

        const status = error?.statusCode ?? error.status;
        const message = error?.message ?? error.body;

        logger.debug(`${error.name}:`, error);

        return of({ headers: {}, ... error, body: message ?? 'Internal Server Error', status: statusCodes[status] ? status : 500 });

      }),
      switchMap((response) => {

        const contentTypeHeader = response.headers['content-type'];

        const charsetString = contentTypeHeader ? contentTypeHeader.split(';')
          .filter((part: string[]) => part.includes('charset='))
          .map((part: string) => part.split('=')[1].toLowerCase())[0]
          ?? 'utf-8' : 'utf-8';

        if (
          charsetString !== 'ascii'
          && charsetString !== 'utf8'
          && charsetString !== 'utf-8'
          && charsetString !== 'utf16le'
          && charsetString !== 'ucs2'
          && charsetString !== 'ucs-2'
          && charsetString !== 'base64'
          && charsetString !== 'latin1'
          && charsetString !== 'binary'
          && charsetString !== 'hex'
        ) {

          logger.warn('Unsupported charset', charsetString);

          return throwError(() => new Error('The specified charset is not supported'));

        }

        // If the body is not a string or a buffer, for example an object, stringify it. This is needed
        // to use Buffer.byteLength and to eventually write the body to the response.
        // Functions will result in 'undefined' which is desired behavior
        const body: string | Buffer = response.body !== undefined && response.body !== null ? typeof response.body === 'string' || response.body instanceof Buffer ? response.body : JSON.stringify(response.body) : undefined;

        const extraHeaders = {
          ... (body !== undefined && body !== null && !response.headers['content-type'] && !response.headers['Content-Type'] && typeof response.body !== 'string' && !(response.body instanceof Buffer)) && { 'content-type': 'application/json' },
          ... (body !== undefined && body !== null) && { 'content-length': Buffer.byteLength(body, charsetString).toString() },
          ... (this.hsts) && { 'strict-transport-security': `max-age=${this.hsts.maxAge}${this.hsts.includeSubDomains ? '; includeSubDomains' : ''}` },
          'x-powered-by': this.poweredBy,
        };

        return of({
          ...response,
          body,
          headers: {
            ...response.headers,
            ...extraHeaders,
          },
        });

      }),
      map((response) => {

        nodeHttpStreams.responseStream.writeHead(response.status, response.headers);

        if (response.body !== undefined && response.body !== null) {

          const contentTypeHeader = response.headers['content-type'] || response.headers['Content-Type'];

          const body = this.parseResponseBody(logger, response.body, contentTypeHeader);
          nodeHttpStreams.responseStream.write(body);

        }

        nodeHttpStreams.responseStream.end();

      }),
    );

  }

}
