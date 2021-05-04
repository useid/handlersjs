import { HandlerError } from './handler-error';

export class HandlerArgumentError extends HandlerError {

  public readonly name = HandlerArgumentError.name;

  constructor(message: string, public value: unknown, cause?: Error) {

    super(message, cause);

    Object.setPrototypeOf(this, HandlerArgumentError.prototype);

  }

}
