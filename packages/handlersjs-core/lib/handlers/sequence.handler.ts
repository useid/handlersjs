import { from, lastValueFrom, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

/**
 * A { Handler<T, S> } that passes the input through a sequence of handlers.
 */
export class SequenceHandler<T, S> extends Handler<T, S> {

  constructor(public handlers: Handler<T, S>[]) {

    super();

    if (!handlers) { throw new HandlerArgumentError('Argument handlers should be set.', handlers); }

  }

  /**
   * Confirms if the handler can handle the input.
   */
  canHandle(input: T, intermediateOutput?: S): Observable<boolean> {

    return of(true);

  }

  /**
   * Handles the input by performing safeHandleMultiple on the sequence of handlers provided.
   *
   * @param input - The input to handle.
   * @param intermediateOutput - The intermediate output to use.
   * @returns { Observable<S> } - The temporary intermediate output of the handler.
   */
  handle(input: T, intermediateOutput?: S): Observable<S> {

    intermediateOutput = intermediateOutput ?? { body: null, status: 200, headers: {} } as unknown as S;

    return of({ handlers: this.handlers, input, intermediateOutput }).pipe(
      switchMap((data) => from(this.safeHandleMultiple(data.handlers, data.input, data.intermediateOutput))),
    );

  }

  /**
   * Calls the safeHandle method of the series of handler provided with the given input and intermediate output.
   *
   * @param { Handler<T, S>[] } handlers - The series of handlers to call.
   * @param input - The input to handle.
   * @param intermediateOutput - The intermediate output to use.
   * @returns { Promise<S> } - The temporary intermediate output of the handler.
   */
  private async safeHandleMultiple(handlers: Handler<T, S>[], input: T, intermediateOutput: S): Promise<S> {

    let temporaryIntermediateOutput = intermediateOutput;

    for (const handler of handlers) {

      temporaryIntermediateOutput = await lastValueFrom(handler.safeHandle(input, temporaryIntermediateOutput));

    }

    return temporaryIntermediateOutput;

  }

}
