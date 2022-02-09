import { from, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class PassThroughHandler<T> implements Handler<T, T> {

  constructor(public handler: Handler<T, any>) {

    if (!handler) { throw new HandlerArgumentError('Argument handler should be set.', handler); }

  }

  handle(input: T): Observable<T> {

    return from(this.handler.handle(input)).pipe(mapTo(input));

  }

}
