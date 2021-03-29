import { Observable } from 'rxjs';
import { Handler } from '@digita-ai/handlersjs-core';
import { HttpHandlerResponse } from './http-handler-response';
import { HttpHandlerContext } from './http-handler-context';

export abstract class HttpHandler extends Handler<HttpHandlerContext, HttpHandlerResponse> {
  public abstract canHandle(context: HttpHandlerContext, response: HttpHandlerResponse): Observable<boolean>;
  public abstract handle(context: HttpHandlerContext, response: HttpHandlerResponse): Observable<HttpHandlerResponse>;
}
