import { from, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class WaterfallHandler<T, S> extends Handler<T, S> {

  constructor(public handlers: Handler<T, S>[]) {

    super();

  }

  canHandle(input: T, intermediateOutput: S): Observable<boolean> {

    return of(true);

  }

  handle(input: T, intermediateOutput: S): Observable<S> {

    return of({ input, intermediateOutput, handlers: this.handlers }).pipe(
      switchMap((data) =>
        this.getFirstToHandle(data.input, data.intermediateOutput, data.handlers).pipe(
          map((handlerToExecute) => ({ ...data, handlerToExecute })),
        )),
      switchMap((data) =>
        data.handlerToExecute ? data.handlerToExecute.handle(data.input, intermediateOutput) : of(intermediateOutput)),
    );

  }

  private getFirstToHandle(
    input: T,
    intermediateOutput: S,
    handlers: Handler<T, S>[],
  ): Observable<Handler<T, S>> {

    if (!this.handlers) {

      throw new HandlerArgumentError('Argument this.handlers should be set.', this.handlers);

    }

    return from(handlers).pipe(
      switchMap((handler) =>
        handler.canHandle(input, intermediateOutput).pipe(map((canHandle) => ({ canHandle, handler })))),
      first((result) => result.canHandle, null),
      map((canHandle) => canHandle?.handler),
    );

  }

}
