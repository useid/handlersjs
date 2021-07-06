import { from, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class PassThroughHandler<T, S> extends Handler<T, S> {

  constructor(public handler: Handler<T, S>) {

    super();

  }

  canHandle(input: T, intermediateOutput: S): Observable<boolean> {

    return of(true);

  }

  handle(input: T, intermediateOutput: S): Observable<S> {

    if (!this.handler) {

      throw new HandlerArgumentError('Argument this.handler should be set.', this.handler);

    }

    return from(this.handler.handle(input, intermediateOutput)).pipe(
      mapTo(intermediateOutput),
    );

  }

}
