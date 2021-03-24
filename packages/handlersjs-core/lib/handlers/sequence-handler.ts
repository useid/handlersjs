import { HandlerArgumentError } from '../errors/handler-argument-error';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Handler } from './handler';

export class SequenceHandler<T, S> extends Handler<T, S> {
  constructor(public handlers: Handler<T, S>[]) {
    super();
  }

  canHandle(input: T, intermediateOutput: S): Observable<boolean> {
    return of(true);
  }

  handle(input: T, intermediateOutput: S): Observable<S> {
    return of({ handlers: this.handlers, input, intermediateOutput }).pipe(
      switchMap((data) => from(this.safeHandleMultiple(data.handlers, data.input, data.intermediateOutput))),
    );
  }

  private async safeHandleMultiple(handlers: Handler<T, S>[], input: T, intermediateOutput: S): Promise<S> {
    if (!this.handlers) {
      throw new HandlerArgumentError('Argument this.handlers should be set.', this.handlers);
    }
    
    let temporaryIntermediateOutput = intermediateOutput;

    for (const handler of handlers) {
      temporaryIntermediateOutput = await handler.safeHandle(input, temporaryIntermediateOutput).toPromise();
    }

    return temporaryIntermediateOutput;
  }
}
