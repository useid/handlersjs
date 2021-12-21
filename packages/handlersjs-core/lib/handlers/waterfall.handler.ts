import { from, Observable, of, throwError, zip } from 'rxjs';
import { catchError, first, switchMap, tap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class WaterfallHandler<T, S> extends Handler<T, S> {

  constructor(public handlers: Handler<T, S>[]) {

    super();

    if (!handlers) { throw new HandlerArgumentError('Argument handlers should be set.', handlers); }

  }

  handle(input: T): Observable<S> {

    return from(this.handlers).pipe(
      switchMap((handler) => zip(of(handler), handler.canHandle(input))),
      first(([ handler, canHandle ]) => canHandle),
      switchMap(([ handler, canHandle ]) => handler.handle(input)),
      catchError(() => throwError(() => new HandlerArgumentError('No handler can handle the input.', input))),
    );

  }

}
