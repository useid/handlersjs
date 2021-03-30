import { HttpHandlerRequest } from './http-handler-request';
import { HttpHandlerRoute } from './http-handler-route';

export interface HttpHandlerContext {
  request: HttpHandlerRequest;
  route?: HttpHandlerRoute;
}
