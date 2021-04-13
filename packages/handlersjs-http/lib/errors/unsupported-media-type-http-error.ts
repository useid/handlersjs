import { HttpError } from './http-error';

/**
 * An error thrown when the media type of incoming data is not supported by a parser.
 */
export class UnsupportedMediaTypeHttpError extends HttpError {
  constructor(message?: string) {
    super(415, 'UnsupportedMediaTypeHttpError', message);
  }

  static isInstance(error: any): error is UnsupportedMediaTypeHttpError {
    return HttpError.isInstance(error) && error.statusCode === 415;
  }
}
