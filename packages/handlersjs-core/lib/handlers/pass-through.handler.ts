import { from, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class PassThroughHandler<T> extends Handler<T, T> {

  constructor(public handler: Handler<T, any>) {

    super();

    if (!handler) { throw new HandlerArgumentError('Argument handler should be set.', handler); }

  }

  handle(input: T): Observable<T> {

    return from(this.handler.handle(input)).pipe(mapTo(input));

  }

}
