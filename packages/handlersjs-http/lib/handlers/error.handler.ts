import { Observable, of, throwError } from 'rxjs';
import { Handler } from '@digita-ai/handlersjs-core';
import { HttpHandlerResponse } from '../models/http-handler-response';

export class ErrorHandler extends Handler<HttpHandlerResponse, HttpHandlerResponse> {

  /**
   * Creates an {ErrorHandler} that catches errors and returns an error response to the given handler.
   *
   * @param {boolean} showUpstreamError - flag to show upstream errors or not
   */
  constructor(private showUpstreamError: boolean = false) {

    super();

  }

  handle(response: HttpHandlerResponse): Observable<HttpHandlerResponse>{

    if (!response) { return throwError(new Error('A response must be provided')); }

    switch (response.status) {

      case undefined: {

        return this.showUpstreamError ? of({ ...response, body: 'The server could not process the request due to an unknown error:\n' + response.body, status: 500 }) : of({ ...response, body: 'The server could not process the request due to an unknown error', status: 500 });

      }

      case 400: return of(this.createErrorResponse(response, 'Bad Request', this.showUpstreamError));
      case 401: return of(this.createErrorResponse(response, 'Unauthorized', this.showUpstreamError));
      case 403: return of(this.createErrorResponse(response, 'Forbidden', this.showUpstreamError));
      case 404: return of(this.createErrorResponse(response, 'Not Found', this.showUpstreamError));
      case 405: return of(this.createErrorResponse(response, 'Method Not Allowed', this.showUpstreamError));
      case 409: return of(this.createErrorResponse(response, 'Conflict', this.showUpstreamError));
      case 500: return of(this.createErrorResponse(response, 'Internal Server Error', this.showUpstreamError));
      default: return response.status < 600 && response.status >= 400
        ? of(this.createErrorResponse(response, 'An Unexpected Error Occurred', this.showUpstreamError))
        : of(response);

    }

  }

  private createErrorResponse(res: HttpHandlerResponse, msg: string, showError: boolean) {

    return showError ? { ...res, body: msg + ': ' + res.body, status: res.status } : { ...res, body: msg, status: res.status  };

  }

  canHandle(response: HttpHandlerResponse): Observable<boolean> {

    return response? of(true) : of(false);

  }

}
