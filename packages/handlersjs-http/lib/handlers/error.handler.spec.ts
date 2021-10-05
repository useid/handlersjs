import { of } from 'rxjs';
import { PipeThroughHandler } from '@digita-ai/handlersjs-core';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { HttpCorsRequestHandler } from './http-cors-request.handler';
import { ErrorHandler } from './error.handler';

const response: HttpHandlerResponse = {
  body: 'upstream response body',
  headers: {
    location: `http://test.be`,
  },
  status: 400,
};

const response200: HttpHandlerResponse = {
  body: 'upstream successful response body',
  headers: {
    location: `http://test.be`,
  },
  status: 200,
};

describe('error_handler', () => {

  const errorHandlerTrue = new ErrorHandler(true);
  const errorHandlerFalse = new ErrorHandler();

  const nestedHttpHandler = {
    canHandle: jest.fn().mockReturnValue(of(true)),
    handle: jest.fn().mockReturnValue(of(response)),
    safeHandle: jest.fn().mockReturnValue(of(response)),
  };

  const corsHandler = new HttpCorsRequestHandler(new PipeThroughHandler([ nestedHttpHandler, errorHandlerTrue ]));

  it('should be instantiated correctly', () => {

    expect(errorHandlerTrue).toBeTruthy();

  });

  describe('handler', () => {

    it('should error when no response was received', async () => {

      await expect(errorHandlerTrue.handle(undefined).toPromise()).rejects.toThrow('A response must be provided');
      await expect(errorHandlerTrue.handle(null).toPromise()).rejects.toThrow('A response must be provided');

    });

    it.each`
    handler             | resp                                  | expected
    ${errorHandlerTrue} | ${{ ...response, status: undefined }} | ${`The server could not process the request due to an unknown error:\n${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: undefined }} | ${`The server could not process the request due to an unknown error`}
    ${errorHandlerTrue} | ${response}                           | ${`Bad Request: ${response.body}`}
    ${errorHandlerFalse}| ${response}                           | ${`Bad Request`}
    ${errorHandlerTrue} | ${{ ...response, status: 401 }}       | ${`Unauthorized: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 401 }}       | ${`Unauthorized`}
    ${errorHandlerTrue} | ${{ ...response, status: 403 }}       | ${`Forbidden: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 403 }}       | ${`Forbidden`}
    ${errorHandlerTrue} | ${{ ...response, status: 404 }}       | ${`Not Found: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 404 }}       | ${`Not Found`}
    ${errorHandlerTrue} | ${{ ...response, status: 405 }}       | ${`Method Not Allowed: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 405 }}       | ${`Method Not Allowed`}
    ${errorHandlerTrue} | ${{ ...response, status: 409 }}       | ${`Conflict: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 409 }}       | ${`Conflict`}
    ${errorHandlerTrue} | ${{ ...response, status: 500 }}       | ${`Internal Server Error: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 500 }}       | ${`Internal Server Error`}
    ${errorHandlerTrue} | ${{ ...response, status: 408 }}       | ${`An Unexpected Error Occurred: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 408 }}       | ${`An Unexpected Error Occurred`}
  `('should return $expected when handler is $a and response is $b', async ({ handler, resp, expected }) => {

      const res = await handler.handle(resp).toPromise();
      expect(res.body).toEqual(expected);

    });

    it('should do nothing if status is 200', async () => {

      const res = await errorHandlerFalse.handle(response200).toPromise();
      expect(res.body).toEqual(`upstream successful response body`);
      expect(res.status).toEqual(200);

    });

    it('should have the correct description provided by the error handler and cors headers provided by the cors handler', async () => {

      const resp = await corsHandler.handle({
        request: {
          url: new URL('http://example.com'),
          method: 'GET',
          headers: {
            accept: 'text/plain',
            origin: 'http://test.de',
          },
        },
      }).toPromise();

      expect(resp).toEqual({ body: 'Bad Request: upstream response body', status: 400, headers: { location: 'http://test.be', 'access-control-allow-origin': '*' } });

    });

  });

  describe('canHandle', () => {

    it('should return true when response is received', async () => {

      await expect(errorHandlerTrue.canHandle(response).toPromise()).resolves.toEqual(true);

    });

    it('should return false when response is not received', async () => {

      await expect(errorHandlerTrue.canHandle(undefined).toPromise()).resolves.toEqual(false);
      await expect(errorHandlerTrue.canHandle(null).toPromise()).resolves.toEqual(false);

    });

  });

});
