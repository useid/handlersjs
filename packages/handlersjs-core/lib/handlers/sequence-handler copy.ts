import { from, Observable, of } from 'rxjs';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export class SequenceHandlerDeTweede<T, S> extends Handler<T, S> {
  constructor(public handlers: Handler<T, S>[]) {
    super();
  }

  canHandle(input: T): Observable<boolean> {
    return of(true);
  }

  handle(input: T): Observable<S> {
    return from(this.safeHandleMultiple(this.handlers, input));
  }

  private async safeHandleMultiple(handlers: Handler<T, S>[], input: T): Promise<S> {
    if (!this.handlers) {
      throw new HandlerArgumentError('Argument this.handlers should be set.', this.handlers);
    }

    let temporaryInput = input;

    for (const handler of handlers) {
      temporaryInput = await handler.handle(temporaryInput, temporaryInput).toPromise();
    }

    return temporaryInput;
  }
}
