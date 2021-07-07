import { from, Observable, of, throwError } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class PassThroughHandler<T, S> extends Handler<T, S> {

  constructor(public handler: Handler<T, S>) {

    super();

    if (!handler) { throw new HandlerArgumentError('Argument handler should be set.', handler); }

  }

  canHandle(input: T, intermediateOutput: S): Observable<boolean> {

    return input && intermediateOutput ? of(true) : of(false);

  }

  handle(input: T, intermediateOutput: S): Observable<S> {

    if (!input) { return throwError(new Error('Argument input should be set.')); }

    if (!intermediateOutput) { return throwError(new Error('Argument intermediateOutput should be set.')); }

    return from(this.handler.handle(input, intermediateOutput)).pipe(
      mapTo(intermediateOutput),
    );

  }

}
