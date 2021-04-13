import { HttpError } from './http-error';

/**
 * An error thrown when an agent is not authorized.
 */
export class UnauthorizedHttpError extends HttpError {
  constructor(message?: string) {
    super(401, 'UnauthorizedHttpError', message);
  }

  static isInstance(error: any): error is UnauthorizedHttpError {
    return HttpError.isInstance(error) && error.statusCode === 401;
  }
}
