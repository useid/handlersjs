import { Observable, of, Subject, throwError } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
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
      map((chunks: any[]) => Buffer.concat(chunks).toString()),
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
