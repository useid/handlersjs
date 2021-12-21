import { Observable } from 'rxjs';
import { Handler } from '@digita-ai/handlersjs-core';
import { HttpHandlerResponse } from './http-handler-response';
import { HttpHandlerContext } from './http-handler-context';

export abstract class HttpHandler<C extends HttpHandlerContext = HttpHandlerContext>
  extends Handler<C, HttpHandlerResponse> {

  public abstract handle(context: C, response?: HttpHandlerResponse): Observable<HttpHandlerResponse>;

}
