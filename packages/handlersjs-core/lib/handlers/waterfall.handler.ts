import { defer, EMPTY, from, Observable, of, throwError } from 'rxjs';
import { catchError, defaultIfEmpty, first, map, switchMap, switchScan, tap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class WaterfallHandler<T, S> extends Handler<T, S> {

  constructor(public handlers: Handler<T, S>[]) {

    super();

    if (!handlers) { throw new HandlerArgumentError('Argument handlers should be set.', handlers); }

  }

  handle(input: T): Observable<S> {

    return this.handlers.reduce<Observable<S>>((previousOutput, nextHandler) => previousOutput.pipe(
      catchError(() => nextHandler.handle(input)),
    ), throwError(() => void 0)).pipe(
      catchError(() => throwError(() => new HandlerArgumentError('No handler can handle the input.', input)))
    );

  }

}
