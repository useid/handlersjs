import { Observable, of } from 'rxjs';
import { Logger } from '@digita-ai/handlersjs-core';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';

export class HttpHandlerOptionsService extends HttpHandler {
  constructor(protected logger: Logger) {
    super();
  }

  canHandle(context: HttpHandlerContext, response?: HttpHandlerResponse): Observable<boolean> {
    this.logger.debug(HttpHandlerOptionsService.name, 'Checking canHandle');

    const isOptions = context.request.method.toLowerCase() === 'options';

    return of(isOptions);
  }

  handle(context: HttpHandlerContext, response?: HttpHandlerResponse): Observable<HttpHandlerResponse> {
    this.logger.debug(HttpHandlerOptionsService.name, 'Running handle');

    const allowedMethods = context.route.operations.join(', ');

    return of({ ...response, headers: { ...response.headers, Allow: allowedMethods } });
  }
}
