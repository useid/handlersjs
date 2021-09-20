import { resolveSoa } from 'dns';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { ErrorHandler } from './error.handler';

const response: HttpHandlerResponse = {
  body: 'url not found',
  headers: {
    location: `http://test.be`,
  },
  status: 404,
};

describe('error_handler', () => {

  const errorHandler = new ErrorHandler(true);

  it('should be instantiated correctly', () => {

    expect(errorHandler).toBeTruthy();

  });

  it('should error when no flag was set', () => {

    expect(() => new ErrorHandler(undefined)).toThrow('An upstream error response flag must be set');
    expect(() => new ErrorHandler(null)).toThrow('An upstream error response flag must be set');

  });

  describe('handler', () => {

    it('should error when no response was received', async () => {

      await expect(errorHandler.handle(undefined).toPromise()).rejects.toThrow('A response must be provided');
      await expect(errorHandler.handle(null).toPromise()).rejects.toThrow('A response must be provided');

    });

  });

  describe('canHandle', () => {

    it('should return true when response is received', async () => {

      await expect(errorHandler.canHandle(response).toPromise()).resolves.toEqual(true);

    });

    it('should return false when response is not received', async () => {

      await expect(errorHandler.canHandle(undefined).toPromise()).resolves.toEqual(false);
      await expect(errorHandler.canHandle(null).toPromise()).resolves.toEqual(false);

    });

  });

});
