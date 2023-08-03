/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';

export type PipeThroughHandler<T, S> = SequenceHandler<T, S>;

export class SequenceHandler<T, S> implements Handler<T, S> {

  constructor(
    public handlers: Handler<any, any>[],
  ) {

    if (!handlers) { throw new HandlerArgumentError('Argument handlers should be set.', handlers); }

  }

  handle(input: any): Observable<S> {

    let tempInp = of(input);

    for (const handler of this.handlers) {

      tempInp = tempInp.pipe(
        switchMap((inp) => handler.handle(inp)),
      );

    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return tempInp;

  }

}
