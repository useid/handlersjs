import { HttpHandler } from './http-handler';
import { HttpHandlerRoute } from './http-handler-route';

export class HttpHandlerController {
  constructor(
    public label: string,
    public routes: HttpHandlerRoute[],
    public preResponseHandler?: HttpHandler,
  ) { }
}
