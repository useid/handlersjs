import { from, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

/**
 * A { Handler<T, S> } that passes the input to the next handler to handle it.
 */
export class PassThroughHandler<T, S> extends Handler<T, S> {

  /**
   * Creates a { PassThroughHandler }.
   *
   * @param { Handler<T, S> } handler - The nested handler to pass the input to.
   */
  constructor(public handler: Handler<T, S>) {

    super();

    if (!handler) { throw new HandlerArgumentError('Argument handler should be set.', handler); }

  }

  /**
   * Confirms if the handler can handle the input.
   */
  canHandle(input: T, intermediateOutput: S): Observable<boolean> {

    return of(true);

  }

  /**
   * Passes the input to the nested handler's handle method and maps it to the intermediate output.
   *
   * @param { T } input - The input to handle.
   * @param { S } intermediateOutput - The intermediate output of the previous handler.
   * @returns The intermediate output of the handler.
   */
  handle(input: T, intermediateOutput: S): Observable<S> {

    return from(this.handler.handle(input, intermediateOutput)).pipe(
      mapTo(intermediateOutput),
    );

  }

}
