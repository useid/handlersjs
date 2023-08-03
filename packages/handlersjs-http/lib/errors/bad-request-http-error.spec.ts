import { BadRequestHttpError } from './bad-request-http-error';

describe('An BadRequestHttpError', (): void => {

  it('has status code 400.', async(): Promise<void> => {

    const error = new BadRequestHttpError('test');

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('test');
    expect(error.name).toBe('BadRequestHttpError');

  });

  it('has a default message if none was provided.', async(): Promise<void> => {

    const error = new BadRequestHttpError();

    expect(error.message).toBe('The given input is not supported by the server configuration.');

  });

  describe('IsInstance', () => {

    it('returns true if isInstance && status code === 400', () => {

      const error = new BadRequestHttpError('test');

      expect(BadRequestHttpError.isInstance(error)).toBe(true);

    });

  });

});
