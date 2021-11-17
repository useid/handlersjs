import { HttpHandlerRequest } from './http-handler-request';
import { HttpHandlerRoute } from './http-handler-route';

/**
 * An interface representing the context, containing a { HttpHandlerRequest } and optional { HttpHandlerRoute }.
 */
export interface HttpHandlerContext {
  request: HttpHandlerRequest;
  route?: HttpHandlerRoute;
}
