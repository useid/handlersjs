import { Handler } from '@useid/handlersjs-core';
import { HttpHandlerResponse } from './http-handler-response';
import { HttpHandlerContext } from './http-handler-context';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export abstract class HttpHandler<C extends HttpHandlerContext = HttpHandlerContext>
  extends Handler<C, HttpHandlerResponse> { }
