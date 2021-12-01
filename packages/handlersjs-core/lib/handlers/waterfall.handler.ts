import { from, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

/**
 * Generic handler that executes the first handler that can handle the input.
 */
export class WaterfallHandler<T, S> extends Handler<T, S> {

  constructor(public handlers: Handler<T, S>[]) {

    super();

    if (!handlers) { throw new HandlerArgumentError('Argument handlers should be set.', handlers); }

  }

  canHandle(input: T, intermediateOutput: S): Observable<boolean> {

    return of(true);

  }

  handle(input: T, intermediateOutput: S): Observable<S> {

    intermediateOutput = intermediateOutput ?? { body: null, status: 200, headers: {} } as unknown as S;

    return of({ input, intermediateOutput, handlers: this.handlers }).pipe(
      switchMap((data) =>
        this.getFirstToHandle(data.input, data.intermediateOutput, data.handlers).pipe(
          map((handlerToExecute) => ({ ...data, handlerToExecute })),
        )),
      switchMap((data) => data.handlerToExecute
        ? data.handlerToExecute.handle(data.input, intermediateOutput)
        : of(intermediateOutput)),
    );

  }

  private getFirstToHandle(
    input: T,
    intermediateOutput: S,
    handlers: Handler<T, S>[],
  ): Observable<Handler<T, S> | undefined> {

    return from(handlers).pipe(
      switchMap((handler) =>
        handler.canHandle(input, intermediateOutput).pipe(map((canHandle) => ({ canHandle, handler })))),
      first((result) => result.canHandle, null),
      map((canHandle) => canHandle?.handler)
    );

  }

}
