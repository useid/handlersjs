import { lastValueFrom, of, throwError } from 'rxjs';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandler } from '../models/http-handler';
import { HttpCorsRequestHandler } from './http-cors-request.handler';
import { ErrorHandler } from './error.handler';

const response: HttpHandlerResponse = {
  body: 'upstream response body',
  headers: {
    location: `http://test.be`,
  },
  status: 400,
};

const context: HttpHandlerContext = {
  request: {
    url: new URL('http://example.org'),
    method: 'GET',
    headers: {},
  },
};

describe('error_handler', () => {

  const nestedHttpHandler = { handle: jest.fn().mockReturnValue(throwError(() => response)) };

  const errorHandlerTrue = new ErrorHandler(nestedHttpHandler, true);

  it('should be instantiated correctly', () => {

    expect(errorHandlerTrue).toBeTruthy();

  });

  it('should error when no nested handler was received', () => {

    expect(() => new ErrorHandler((null as unknown as HttpHandler))).toThrow('A HttpHandler must be provided');
    expect(() => new ErrorHandler((undefined as unknown as HttpHandler))).toThrow('A HttpHandler must be provided');

  });

  describe('handle', () => {

    it.each`
    flag    | status         | expected
    ${true} | ${ undefined } | ${`${response.body}`}
    ${false}| ${ undefined } | ${`Internal Server Error`}
    ${true} | ${ 400 }       | ${`${response.body}`}
    ${false}| ${ 400 }       | ${`Bad Request`}
    ${true} | ${ 500 }       | ${`${response.body}`}
    ${false}| ${ 500 }       | ${`Internal Server Error`}

  `('should return $expected when $status is handled and flag is $flag', async ({ flag, status, expected }) => {

      nestedHttpHandler.handle = jest.fn().mockReturnValue(throwError(() => ({ ... response, status })));

      const newErrorHandler = new ErrorHandler(nestedHttpHandler, flag as boolean);

      const res = await lastValueFrom(newErrorHandler.handle(context));

      expect(res.body).toEqual(expected);

    });

    it('should set the upstream error as body when no body was provided in the response', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValue(
        throwError(() => ({ ... response, status: 444, body: undefined })),
      );

      const newErrorHandler = new ErrorHandler(nestedHttpHandler, true);

      const res = lastValueFrom(newErrorHandler.handle(context));

      await expect(res).resolves.toEqual({
        body: {
          body: undefined,
          headers: { location: 'http://test.be' },
          status: 444,
        },
        headers: { location: 'http://test.be' },
        status: 500,
      });

    });

    it('should set an empty headers object on the response if none was provided and status as 500 if not known', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValue(
        throwError(() => ({ ... response, status: 444, headers: undefined })),
      );

      const newErrorHandler = new ErrorHandler(nestedHttpHandler, true);

      const res = await lastValueFrom(newErrorHandler.handle(context));

      expect(res.headers).toEqual({});
      expect(res.status).toBe(500);

    });

    it('should do nothing if status is 200', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValue(of({ ... response, status: 200 }));

      const newErrorHandler = new ErrorHandler(nestedHttpHandler, true);

      const res = await lastValueFrom(newErrorHandler.handle(context));

      expect(res.body).toBe(`upstream response body`);
      expect(res.status).toBe(200);

    });

    it('should have the correct description provided by the error handler and cors headers provided by the cors handler', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValue(throwError(() => ({ ... response, status: 400 })));

      const newErrorHandler = new ErrorHandler(nestedHttpHandler, true);
      const corsHandler = new HttpCorsRequestHandler(newErrorHandler);

      const resp = await lastValueFrom(corsHandler.handle({
        request: {
          url: new URL('http://example.com'),
          method: 'GET',
          headers: {
            accept: 'text/plain',
            origin: 'http://test.de',
          },
        },
      }));

      expect(resp).toEqual({ body: 'upstream response body', status: 400, headers: { location: 'http://test.be', 'access-control-allow-origin': '*' } });

    });

  });

});
