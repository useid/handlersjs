import { Handler } from '@useid/handlersjs-core';
import { HttpHandlerContext } from './http-handler-context';
import { HttpHandlerRoute } from './http-handler-route';

export class HttpHandlerController<C extends HttpHandlerContext = HttpHandlerContext> {

  constructor(
    public label: string,
    public routes: HttpHandlerRoute<C>[],
    public preResponseHandler?: Handler<HttpHandlerContext, C>,
  ) { }

}
