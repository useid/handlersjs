import { Observable, of, throwError } from 'rxjs';
import { Handler } from '@digita-ai/handlersjs-core';
import { catchError } from 'rxjs/operators';
import { HttpHandlerResponse } from 'models/http-handler-response';

export class ErrorHandler extends Handler<HttpHandlerResponse, HttpHandlerResponse> {

  /**
   * Creates an {ErrorHandler} that catches errors and returns an error response to the given handler.
   *
   * @param {HttpHandler} httpHandler - the handler to which to pass the error response.
   */
  constructor(private showUpstreamError: boolean) {

    super();

    if (!showUpstreamError) { throw new Error('An upstream error response flag must be set'); }

  }

  handle(response: HttpHandlerResponse): Observable<HttpHandlerResponse>{

    if (!response) { return throwError(new Error('A response must be provided')); }

    return of(response).pipe(
      catchError((error) => error.message
        ? this.showUpstreamError ? of({ ...response, body: 'The server could not process the request due to an error:\n' + error.message, status: error.status }) : of({ ...response, status: error.status })
        : of(response))
    );

  }

  canHandle(response: HttpHandlerResponse): Observable<boolean> {

    return response? of(true) : of(false);

  }

}
