import { BadRequestHttpError } from './bad-request-http-error';
import { ConflictHttpError } from './conflict-http-error';
import { ForbiddenHttpError } from './forbidden-http-error';
import { HttpError } from './http-error';
import { InternalServerError } from './internal-server-error';
import { MethodNotAllowedHttpError } from './method-not-allowed-http-error';
import { NotFoundHttpError } from './not-found-http-error';
import { NotImplementedHttpError } from './not-implemented-http-error';
import { UnauthorizedHttpError } from './unauthorized-http-error';
import { UnsupportedMediaTypeHttpError } from './unsupported-media-type-http-error';

// Only used to make typings easier in the tests
class FixedHttpError extends HttpError {

  constructor(message?: string) {

    super(0, '', message);

  }

}

describe('An HttpError', (): void => {

  const errors: [string, number, typeof FixedHttpError][] = [
    [ 'BadRequestHttpError', 400, BadRequestHttpError ],
    [ 'UnauthorizedHttpError', 401, UnauthorizedHttpError ],
    [ 'ForbiddenHttpError', 403, ForbiddenHttpError ],
    [ 'NotFoundHttpError', 404, NotFoundHttpError ],
    [ 'MethodNotAllowedHttpError', 405, MethodNotAllowedHttpError ],
    [ 'ConflictHttpError', 409, ConflictHttpError ],
    [ 'MethodNotAllowedHttpError', 405, MethodNotAllowedHttpError ],
    [ 'UnsupportedMediaTypeHttpError', 415, UnsupportedMediaTypeHttpError ],
    [ 'InternalServerError', 500, InternalServerError ],
    [ 'NotImplementedHttpError', 501, NotImplementedHttpError ],
  ];

  it.each(errors)('%s is valid', (name, statusCode, constructor): void => {

    const instance = new constructor('message');

    expect(constructor.isInstance(instance)).toBeTruthy();
    expect(instance.statusCode).toBe(statusCode);
    expect(instance.name).toBe(name);
    expect(instance.message).toBe('message');

  });

});
