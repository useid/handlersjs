import { Handler, SequenceHandler } from '@useid/handlersjs-core';
import { Observable } from 'rxjs';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';

export class HttpSequenceHandler<C extends HttpHandlerContext> extends HttpHandler<C> {

  private sequenceHandler: SequenceHandler<C, HttpHandlerResponse>;

  constructor(handlers: Handler[]) {

    super();
    this.sequenceHandler = new SequenceHandler(handlers);

  }

  handle(input: C): Observable<HttpHandlerResponse<any>> {

    return this.sequenceHandler.handle(input);

  }

}
