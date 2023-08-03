import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class PassThroughHandler<T> implements Handler<T, T> {

  constructor(public handler: Handler<T, unknown>) {

    if (!handler) { throw new HandlerArgumentError('Argument handler should be set.', handler); }

  }

  handle(input: T): Observable<T> {

    return from(this.handler.handle(input)).pipe(map(() => input));

  }

}
