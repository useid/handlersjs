import { HttpError } from './http-error';

/**
 * An error thrown when incoming data is not supported.
 * Probably because an {@link AsyncHandler} returns false on the canHandle call.
 */
export class BadRequestHttpError extends HttpError {
  /**
   * Default message is 'The given input is not supported by the server configuration.'.
   *
   * @param message - Optional, more specific, message.
   */
  constructor(message?: string) {
    super(400, 'BadRequestHttpError', message ?? 'The given input is not supported by the server configuration.');
  }

  static isInstance(error: any): error is BadRequestHttpError {
    return HttpError.isInstance(error) && error.statusCode === 400;
  }
}
