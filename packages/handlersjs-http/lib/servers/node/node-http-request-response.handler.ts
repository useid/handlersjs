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
export class NodeHttpRequestResponseHandler extends NodeHttpStreamsHandler {

  /**
   * Creates a {NodeHttpRequestResponseHandler} passing requests through the given handler.
   *
   * @param {HttpHandler} httpHandler - the handler through which to pass incoming requests.
   */
  constructor(private httpHandler: HttpHandler) {

    super();

    if (!httpHandler) {

      throw new Error('A HttpHandler must be provided');

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

    const url = nodeHttpStreams.requestStream.url;

    if (!url) {

      return throwError(new Error('url of the request cannot be null or undefined.'));

    }

    const method = Object.values(HttpMethods).find((m) => m === nodeHttpStreams.requestStream.method);

    if (!method) {

      return throwError(new Error('method of the request cannot be null or undefined.'));

    }

    if (!nodeHttpStreams.requestStream.headers) {

      return throwError(new Error('headers of the request cannot be null or undefined.'));

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
        };

        return { request: body !== '' ? Object.assign(httpHandlerRequest, { body }) : httpHandlerRequest };

      }),
      switchMap((context: HttpHandlerContext) => this.httpHandler.handle(context)),
      catchError((error) => {

        if (error.status && !error.headers) {

          error.headers = {};

        }

        switch (error.status) {

          // Provide custom errors for common status codes
          case 400: return of({ ...error, body: 'Bad Request' });
          case 401: return of({ ...error, body: 'Unauthorized' });
          case 403: return of({ ...error, body: 'Forbidden' });
          case 404: return of({ ...error, body: 'Not Found' });
          case 405: return of({ ...error, body: 'Method Not Allowed' });
          case 500: return of({ ...error, body: 'Internal Server Error' });

          // if status is undefined, check if the error has a message, otherwise return server error response without the message.
          case undefined: {

            if(error.message) {

              return of({ body: 'The server could not process the request due to an error:\n' + error.message, headers: {}, status: 500 });

            } else {

              return of({ body: 'Internal Server Error', headers: {}, status: 500 });

            }

          }

          // If no cases match, return a default error message.
          default: return error.status < 600 && error.status >= 400 ?  of({ ...error, body: 'An Unexpected Error Occured' }) : of({ body: 'An Unexpected Error Occured', headers: error.headers, status: 500 });

        }

      }),
      map((response) => {

        nodeHttpStreams.responseStream.writeHead(response.status, response.headers);

        if (response?.body) {

          nodeHttpStreams.responseStream.write(response.body);

        }

        nodeHttpStreams.responseStream.end();

      }),
    );

  }

  /**
   * Indicates this handler accepts every NodeHttpStreams pair as input.
   *
   * @param {NodeHttpStreams} input - the incoming streams
   * @returns always `of(true)`
   */
  canHandle(input: NodeHttpStreams): Observable<boolean> {

    return input && input.requestStream && input.responseStream ? of(true) : of(false);

  }

}
