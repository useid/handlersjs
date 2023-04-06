import { Logger } from '@digita-ai/handlersjs-logging';
import { HttpHandlerRequest } from './http-handler-request';
import { HttpHandlerRoute } from './http-handler-route';

export interface HttpHandlerContext {
  request: HttpHandlerRequest;
  logger: Logger;
  route?: HttpHandlerRoute;
}
