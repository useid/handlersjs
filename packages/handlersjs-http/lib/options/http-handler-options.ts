import { Observable, of } from 'rxjs';
import { HttpHandler } from '../general/http-handler';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandlerResponse } from '../general/http-handler-response';
import { Logger } from '@digita-ai/handlersjs-core';

export class HttpHandlerOptionsService extends HttpHandler {
  constructor(protected logger: Logger) {
    super();
  }

  canHandle(context: HttpHandlerContext, response: HttpHandlerResponse): Observable<boolean> {
    this.logger.debug(HttpHandlerOptionsService.name, 'Checking canHandle');

    const isOptions = context.request.method.toLowerCase() === 'options';

    return of(isOptions);
  }

  handle(context: HttpHandlerContext, response: HttpHandlerResponse): Observable<HttpHandlerResponse> {
    this.logger.debug(HttpHandlerOptionsService.name, 'Running handle');

    const allowedMethods = context.route.operations.join(', ');

    return of({ ...response, headers: { ...response.headers, Allow: allowedMethods } });
  }
}
