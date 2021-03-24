import { HandlerArgumentError } from '../errors/handler-argument-error';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Handler } from './handler';

export class PassthroughHandler<T, S> extends Handler<T, S> {
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

    return of({ handler: this.handler, input, intermediateOutput }).pipe(
      switchMap((data) => from(data.handler.safeHandle(input, intermediateOutput))
        .pipe(map((newIntermediateOutput) => ({ ...data, newIntermediateOutput })))),
      map((data) => data.intermediateOutput),
    );
  }
}
