import { from, lastValueFrom, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class SequenceHandler<T, S> extends Handler<T, S> {

  constructor(public handlers: Handler<T, S>[]) {

    super();

    if (!handlers) { throw new HandlerArgumentError('Argument handlers should be set.', handlers); }

  }

  canHandle(input: T, intermediateOutput?: S): Observable<boolean> {

    return of(true);

  }

  handle(input: T, intermediateOutput?: S): Observable<S> {

    intermediateOutput = intermediateOutput ?? { body: null, status: 200, headers: {} } as unknown as S;

    return of({ handlers: this.handlers, input, intermediateOutput }).pipe(
      switchMap((data) => from(this.safeHandleMultiple(data.handlers, data.input, data.intermediateOutput))),
    );

  }

  private async safeHandleMultiple(handlers: Handler<T, S>[], input: T, intermediateOutput: S): Promise<S> {

    let temporaryIntermediateOutput = intermediateOutput;

    for (const handler of handlers) {

      temporaryIntermediateOutput = await lastValueFrom(handler.safeHandle(input, temporaryIntermediateOutput));

    }

    return temporaryIntermediateOutput;

  }

}
