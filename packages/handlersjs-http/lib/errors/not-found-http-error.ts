import { HttpError } from './http-error';
/**
 * An error thrown when no data was found for the requested identifier.
 */
export class NotFoundHttpError extends HttpError {
  constructor(message?: string) {
    super(404, 'NotFoundHttpError', message);
  }

  static isInstance(error: any): error is NotFoundHttpError {
    return HttpError.isInstance(error) && error.statusCode === 404;
  }
}
