import { HttpError } from './http-error';
/**
 * An error thrown when a request conflict with current state of the server.
 */
export class ConflictHttpError extends HttpError {
  constructor(message?: string) {
    super(409, 'ConflictHttpError', message);
  }

  static isInstance(error: any): error is ConflictHttpError {
    return HttpError.isInstance(error) && error.statusCode === 409;
  }
}
