import { HandlerError } from '@useid/handlersjs-core';
import { HttpHandlerResponse } from '../models/http-handler-response';

export class HttpHandlerError extends HandlerError {

  public readonly name = HttpHandlerError.name;

  constructor(message: string, public status: number, public response: HttpHandlerResponse, cause?: Error) {

    super(message, cause);

    Object.setPrototypeOf(this, HttpHandlerError.prototype);

  }

}
