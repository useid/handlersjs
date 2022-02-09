import { Observable, of, Subject, throwError } from 'rxjs';
import { map, switchMap, toArray, catchError } from 'rxjs/operators';
import { HttpHandler } from '../../models/http-handler';
import { HttpHandlerContext } from '../../models/http-handler-context';
import { HttpHandlerRequest } from '../../models/http-handler-request';
import { HttpMethods } from '../../models/http-method';
import { NodeHttpStreamsHandler } from './node-http-streams.handler';
import { NodeHttpStreams } from './node-http-streams.model';

/**
 * A {NodeHttpStreamsHandler} reading the request stream into a {HttpHandlerRequest},
 * passing it through a {HttpHandler} and writing the resulting {HttpHandlerResponse} to the response stream.
 */
export class NodeHttpRequestResponseHandler implements NodeHttpStreamsHandler {

  /**
   * Creates a {NodeHttpRequestResponseHandler} passing requests through the given handler.
   *
   * @param {HttpHandler} httpHandler - the handler through which to pass incoming requests.
   */
  constructor(private httpHandler: HttpHandler) {

    if (!httpHandler) {

      throw new Error('A HttpHandler must be provided');

    }

  }

  private parseBody(body: string, contentType?: string): string | { [key: string]: string } {

    switch (contentType) {

      case 'application/json':
        return JSON.parse(body);
      // case 'application/x-www-form-urlencoded':
      //   return JSON.parse(`{"${decodeURIComponent(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
      default:
        return body;

    }

  }

  /**
   * Reads the requestStream of its NodeHttpStreams pair into a HttpHandlerRequest,
   * creates a HttpHandlerContext from it, passes it through the {HttpHandler},
   * and writes the result to the responseStream.
   *
   * @param {NodeHttpStreams} noteHttpStreams - the incoming set of Node.js HTTP read and write streams
   * @returns an {Observable<void>} for completion detection
   */
  handle(nodeHttpStreams: NodeHttpStreams): Observable<void> {

    if (!nodeHttpStreams) {

      return throwError(() => new Error('node http streams object cannot be null or undefined.'));

    }

    if (!nodeHttpStreams.requestStream) {

      return throwError(() => new Error('request stream cannot be null or undefined.'));

    }

    if (!nodeHttpStreams.responseStream) {

      return throwError(() => new Error('response stream cannot be null or undefined.'));

    }

    const url = nodeHttpStreams.requestStream.url;

    if (!url) {

      return throwError(() => new Error('url of the request cannot be null or undefined.'));

    }

    const method = Object.values(HttpMethods).find((m) => m === nodeHttpStreams.requestStream.method);

    if (!method) {

      return throwError(() => new Error('method of the request cannot be null or undefined.'));

    }

    if (!nodeHttpStreams.requestStream.headers) {

      return throwError(() => new Error('headers of the request cannot be null or undefined.'));

    }

    const buffer = new Subject<any>();

    nodeHttpStreams.requestStream.on('data', (chunk) => buffer.next(chunk));
    nodeHttpStreams.requestStream.on('end', () => buffer.complete());

    return buffer.pipe(
      toArray(),
      map((chunks) => Buffer.concat(chunks).toString()),
      map((body) => {

        const urlObject: URL = new URL(url, `http://${nodeHttpStreams.requestStream.headers.host}`);

        const httpHandlerRequest: HttpHandlerRequest = {
          url: urlObject,
          method,
          headers: nodeHttpStreams.requestStream.headers as { [key: string]: string },
          ... (body && body !== '') && { body: this.parseBody(body, nodeHttpStreams.requestStream.headers['content-type']) },
        };

        return { request: httpHandlerRequest };

      }),
      switchMap((context: HttpHandlerContext) => this.httpHandler.handle(context)),
      catchError((error) => of({ headers: {}, ...error, body: 'Internal Server Error', status: 500 })),
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

          return throwError(() => new Error('The specified charset is not supported'));

        }

        // If the body is not a string or a buffer, for example an object, stringify it. This is needed
        // to use Buffer.byteLength and to eventually write the body to the response.
        // Functions will result in 'undefined' which is desired behavior
        const body: string | Buffer = response.body ? typeof response.body === 'string' || response.body instanceof Buffer ? response.body : JSON.stringify(response.body) : undefined;

        const extraHeaders = {
          ... (body && !response.headers['content-type'] && !response.headers['Content-Type'] && typeof response.body !== 'string' && !(response.body instanceof Buffer)) && { 'content-type': 'application/json' },
          ... (body) && { 'content-length': Buffer.byteLength(body, charsetString).toString() },
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

        if (response.body) {

          nodeHttpStreams.responseStream.write(response.body);

        }

        nodeHttpStreams.responseStream.end();

      }),
    );

  }

}
