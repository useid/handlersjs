import { from, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class SequenceHandler<T, S> extends Handler<T, S> {

  constructor(public handlers: Handler<T, S>[]) {

    super();

    if (!this.handlers) { throw new HandlerArgumentError('Argument handlers should be set.', this.handlers); }

  }

  canHandle(input: T, intermediateOutput: S): Observable<boolean> {

    return input && intermediateOutput ? of(true): of(false);

  }

  handle(input: T, intermediateOutput: S): Observable<S> {

    if (!input) { return throwError(new HandlerArgumentError('Argument input should be set.', input)); }

    if (!intermediateOutput) { return throwError(new HandlerArgumentError('Argument intermediateOutput should be set.', intermediateOutput)); }

    intermediateOutput = intermediateOutput ?? { body: null, status: 200, headers: {} } as unknown as S;

    return of({ handlers: this.handlers, input, intermediateOutput }).pipe(
      switchMap((data) => from(this.safeHandleMultiple(data.handlers, data.input, data.intermediateOutput))),
    );

  }

  private async safeHandleMultiple(handlers: Handler<T, S>[], input: T, intermediateOutput: S): Promise<S> {

    let temporaryIntermediateOutput = intermediateOutput;

    for (const handler of handlers) {

      temporaryIntermediateOutput = await handler.safeHandle(input, temporaryIntermediateOutput).toPromise();

    }

    return temporaryIntermediateOutput;

  }

}
