import { HttpError } from './http-error';

/**
 * An error thrown when an agent is not allowed to access data.
 */
export class ForbiddenHttpError extends HttpError {
  constructor(message?: string) {
    super(403, 'ForbiddenHttpError', message);
  }

  static isInstance(error: any): error is ForbiddenHttpError {
    return HttpError.isInstance(error) && error.statusCode === 403;
  }
}
