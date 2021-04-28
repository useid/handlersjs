import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import serialize from 'rdf-serialize';
import { Logger } from '@digita-ai/handlersjs-core';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';

export class HttpContentNegotiationHandler extends HttpHandler {
  constructor(
    private handler: HttpHandler,
    private logger: Logger,
    private defaultContentType: string,
  ) {
    super();
  }

  canHandle(context: HttpHandlerContext): Observable<boolean> {
    this.logger.debug(HttpContentNegotiationHandler.name, 'Checking content negotiation handler', { context });

    return of(context.request.headers.accept !== 'application/json');
  }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {
    this.logger.debug(HttpContentNegotiationHandler.name, 'Running content negotiation handler', { context });

    if (!context.request) {
      return throwError(new Error('Argument request should be set.'));
    }

    const request = context.request;
    const contentType =
      !request.headers.accept || request.headers.accept === '*/*'
        ? this.defaultContentType
        : request.headers.accept;

    return this.isContentTypeSupported(contentType).pipe(
      switchMap((isContentTypeSupported) => !isContentTypeSupported ? of({ status: 406, headers: {} }) :
        this.handler.handle(context).pipe(
          map((response) => ({
            ...response,
            headers: {
              ...response.headers,
              'content-type': contentType,
            },
          })),
        )),
    );
  }

  private isContentTypeSupported(contentType: string): Observable<boolean> {
    if (!contentType) {
      return throwError(new Error('Argument contentType should be set.'));
    }

    return from(serialize.getContentTypes()).pipe(
      switchMap((contentTypes) => contentTypes ?
        of(contentTypes.some((c) => c === contentType)):
        throwError(new Error('contentTypes should be set.'))),
    );
  }
}
