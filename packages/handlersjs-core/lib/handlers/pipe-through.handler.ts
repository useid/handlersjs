import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

/**
 * A { Handler<T, S> } that handles the input by piping it through a series of handlers
 * calling each of it's handle methods.
 */
export class PipeThroughHandler<T, S> extends Handler<T, S> {

  /**
   * Creates a { PipeThroughHandler }.
   *
   * @param { Handler<any, any>[] } handlers - A list of handlers to pipe the input through.
   */
  constructor(
    public handlers: Handler<any, any>[],
  ) {

    super();

    if (!handlers) { throw new HandlerArgumentError('Argument handlers should be set.', handlers); }

  }

  /**
   * Confirms if the handler can handle the input.
   */
  canHandle(input: any): Observable<boolean> {

    return of(true);

  }

  /**
   * Handles the input by piping it into a new input object and passing it through a series of handlers
   *
   * @param { any } input - The input to handle.
   * @returns { Observable<S> } - The intermediate output of the handler.
   */
  handle(input: any): Observable<S> {

    let tempInp = of(input);

    for (const handler of this.handlers) {

      tempInp = tempInp.pipe(
        switchMap((inp) => handler.handle(inp)),
      );

    }

    return tempInp;

  }

}
