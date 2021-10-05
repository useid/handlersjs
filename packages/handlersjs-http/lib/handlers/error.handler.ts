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
      case 402: return of(this.createErrorResponse(response, 'Payment Required', this.showUpstreamError));
      case 403: return of(this.createErrorResponse(response, 'Forbidden', this.showUpstreamError));
      case 404: return of(this.createErrorResponse(response, 'Not Found', this.showUpstreamError));
      case 405: return of(this.createErrorResponse(response, 'Method Not Allowed', this.showUpstreamError));
      case 406: return of(this.createErrorResponse(response, 'Not Acceptable', this.showUpstreamError));
      case 407: return of(this.createErrorResponse(response, 'Proxy Authentication Required', this.showUpstreamError));
      case 408: return of(this.createErrorResponse(response, 'Request Timeout', this.showUpstreamError));
      case 409: return of(this.createErrorResponse(response, 'Conflict', this.showUpstreamError));
      case 410: return of(this.createErrorResponse(response, 'Gone', this.showUpstreamError));
      case 411: return of(this.createErrorResponse(response, 'Length Required', this.showUpstreamError));
      case 412: return of(this.createErrorResponse(response, 'Precondition Failed', this.showUpstreamError));
      case 413: return of(this.createErrorResponse(response, 'Payload Too Large', this.showUpstreamError));
      case 414: return of(this.createErrorResponse(response, 'URI Too Long', this.showUpstreamError));
      case 415: return of(this.createErrorResponse(response, 'Unsupported Media Type', this.showUpstreamError));
      case 416: return of(this.createErrorResponse(response, 'Range Not Satisfiable', this.showUpstreamError));
      case 417: return of(this.createErrorResponse(response, 'Expectation Failed', this.showUpstreamError));
      case 418: return of(this.createErrorResponse(response, `I'm a teapot`, this.showUpstreamError));
      case 421: return of(this.createErrorResponse(response, 'Misdirected Request', this.showUpstreamError));
      case 422: return of(this.createErrorResponse(response, 'Unprocessable Entity', this.showUpstreamError));
      case 423: return of(this.createErrorResponse(response, 'Locked', this.showUpstreamError));
      case 424: return of(this.createErrorResponse(response, 'Failed Dependency', this.showUpstreamError));
      case 425: return of(this.createErrorResponse(response, 'Too Early', this.showUpstreamError));
      case 426: return of(this.createErrorResponse(response, 'Upgrade Required', this.showUpstreamError));
      case 428: return of(this.createErrorResponse(response, 'Precondition required', this.showUpstreamError));
      case 429: return of(this.createErrorResponse(response, 'Too Many Requests', this.showUpstreamError));
      case 431: return of(this.createErrorResponse(response, 'Request Header Fields Too Large', this.showUpstreamError));
      case 451: return of(this.createErrorResponse(response, 'Unavailable For Legal Reasons', this.showUpstreamError));
      case 500: return of(this.createErrorResponse(response, 'Internal Server Error', this.showUpstreamError));
      case 501: return of(this.createErrorResponse(response, 'Not Implemented', this.showUpstreamError));
      case 502: return of(this.createErrorResponse(response, 'Bad Gateway', this.showUpstreamError));
      case 503: return of(this.createErrorResponse(response, 'Service Unavailable', this.showUpstreamError));
      case 504: return of(this.createErrorResponse(response, 'Gateway Timeout', this.showUpstreamError));
      case 505: return of(this.createErrorResponse(response, 'HTTP Version Not Supported', this.showUpstreamError));
      case 506: return of(this.createErrorResponse(response, 'Variant Also Negotiates', this.showUpstreamError));
      case 507: return of(this.createErrorResponse(response, 'Insufficient Storage', this.showUpstreamError));
      case 508: return of(this.createErrorResponse(response, 'Loop detected', this.showUpstreamError));
      case 510: return of(this.createErrorResponse(response, 'Not Extended', this.showUpstreamError));
      case 511: return of(this.createErrorResponse(response, 'Network Authentication Required', this.showUpstreamError));
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
