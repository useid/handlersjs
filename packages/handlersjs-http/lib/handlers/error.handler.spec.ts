import { HttpHandlerResponse } from '../models/http-handler-response';
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
    ${errorHandlerTrue} | ${{ ...response, status: 500 }}       | ${`Internal Server Error: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 500 }}       | ${`Internal Server Error`}
    ${errorHandlerTrue} | ${{ ...response, status: 409 }}       | ${`An Unexpected Error Occurred: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 409 }}       | ${`An Unexpected Error Occurred`}
  `('should return $expected when handler is $a and response is $b', async ({ handler, resp, expected }) => {

      const res = await handler.handle(resp).toPromise();
      expect(res.body).toEqual(expected);

    });

    it('should do nothing if status is 200', async () => {

      const res = await errorHandlerFalse.handle(response200).toPromise();
      expect(res.body).toEqual(`upstream successful response body`);
      expect(res.status).toEqual(200);

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
