import { combineLatest, Observable, of, Subject, throwError } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
import { HttpHandler } from '../general/http-handler';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandlerRequest } from '../general/http-handler-request';
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
    if (!nodeHttpStreams.requestStream.url) {
      return throwError(new Error('url of the request cannot be null or undefined.'));
    }
    if (!nodeHttpStreams.requestStream.method) {
      return throwError(new Error('method of the request cannot be null or undefined.'));
    }
    if (!nodeHttpStreams.requestStream.headers) {
      return throwError(new Error('headers of the request cannot be null or undefined.'));
    }

    const buffer = new Subject<any>();

    nodeHttpStreams.requestStream.on('data', (chunk) => buffer.next(chunk));
    nodeHttpStreams.requestStream.on('end', () => buffer.complete());

    return combineLatest(
      buffer.pipe(
        toArray(),
        map((chunks: any[]) => Buffer.concat(chunks).toString()),
      ),
      of(nodeHttpStreams.requestStream.url),
      of(nodeHttpStreams.requestStream.method),
      of(nodeHttpStreams.requestStream.headers),
    ).pipe(
      map(([ body, url, method, headers ]) => {

        let httpHandlerRequest = {
          path: url,
          method,
          headers: headers as { [key: string]: string },
        };

        const splitURL =  url.split('?');
        if (splitURL.length > 1) {
          const splitQuery = splitURL[1].split('&')
            .map((term: string) => term.split('='));
          const query = new Map<string, string>(splitQuery
            .map((param) => [ param[0], param[1] ]));
          httpHandlerRequest = Object.assign(httpHandlerRequest, { query });
        }

        return { request: body !== '' ? Object.assign(httpHandlerRequest, { body }) : httpHandlerRequest };

      }),
      switchMap((context: HttpHandlerContext) => this.httpHandler.handle(context)),
      map((response) => {
        nodeHttpStreams.responseStream.writeHead(response.status, response.headers);
        nodeHttpStreams.responseStream.write(response.body);
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
