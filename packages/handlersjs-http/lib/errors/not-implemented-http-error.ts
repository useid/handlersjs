import { HttpError } from './http-error';
/**
 * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
 * Usually this implies future availability (e.g., a new feature of a web-service API).
 */
export class NotImplementedHttpError extends HttpError {
  constructor(message?: string) {
    super(501, 'NotImplementedHttpError', message);
  }

  static isInstance(error: any): error is NotImplementedHttpError {
    return HttpError.isInstance(error) && error.statusCode === 501;
  }
}
