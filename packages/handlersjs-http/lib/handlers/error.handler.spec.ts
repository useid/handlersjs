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

    it('should return a custom + original body when status code is undefined and flag is true', async () => {

      const res = await errorHandlerTrue.handle({ ...response, status: undefined }).toPromise();
      expect(res.body).toEqual(`The server could not process the request due to an unknown error:\n${response.body}`);

    });

    it('should not return the original body when status code is undefined and flag is false', async () => {

      const res = await errorHandlerFalse.handle({ ...response, status: undefined }).toPromise();
      expect(res.body).toEqual(`The server could not process the request due to an unknown error`);

    });

    it('should return a Bad Request error message with the original body if status code is 400 and flag is true', async () => {

      const res = await errorHandlerTrue.handle(response).toPromise();
      expect(res.body).toContain(`Bad Request: ${response.body}`);

    });

    it('should return a Bad Request error message without the original body if status code is 400 and flag is false', async () => {

      const res = await errorHandlerFalse.handle(response).toPromise();
      expect(res.body).toEqual('Bad Request');

    });

    it('should return a Unauthorized error message with the original body if status code is 401 and flag is true', async () => {

      const res = await errorHandlerTrue.handle({ ...response, status: 401 }).toPromise();
      expect(res.body).toContain(`Unauthorized: ${response.body}`);

    });

    it('should return a Unauthorized error message without the original body if status code is 401 and flag is false', async () => {

      const res = await errorHandlerFalse.handle({ ...response, status: 401 }).toPromise();
      expect(res.body).toEqual('Unauthorized');

    });

    it('should return a Forbidden error message with the original body if status code is 403 and flag is true', async () => {

      const res = await errorHandlerTrue.handle({ ...response, status: 403 }).toPromise();
      expect(res.body).toContain(`Forbidden: ${response.body}`);

    });

    it('should return a Forbidden error message without the original body if status code is 403 and flag is false', async () => {

      const res = await errorHandlerFalse.handle({ ...response, status: 403 }).toPromise();
      expect(res.body).toEqual('Forbidden');

    });

    it('should return a Not Found error message with the original body if status code is 404 and flag is true', async () => {

      const res = await errorHandlerTrue.handle({ ...response, status: 404 }).toPromise();
      expect(res.body).toContain(`Not Found: ${response.body}`);

    });

    it('should return a Not Found error message without the original body if status code is 404 and flag is false', async () => {

      const res = await errorHandlerFalse.handle({ ...response, status: 404 }).toPromise();
      expect(res.body).toEqual('Not Found');

    });

    it('should return a Method Not Allowed error message with the original body if status code is 405 and flag is true', async () => {

      const res = await errorHandlerTrue.handle({ ...response, status: 405 }).toPromise();
      expect(res.body).toContain(`Method Not Allowed: ${response.body}`);

    });

    it('should return a Method Not Allowed error message without the original body if status code is 405 and flag is false', async () => {

      const res = await errorHandlerFalse.handle({ ...response, status: 405 }).toPromise();
      expect(res.body).toEqual('Method Not Allowed');

    });

    it('should return an Internal Server Error error message with the original body if status code is 500 and flag is true', async () => {

      const res = await errorHandlerTrue.handle({ ...response, status: 500 }).toPromise();
      expect(res.body).toEqual(`Internal Server Error: ${response.body}`);

    });

    it('should return an Internal Server Error error message with the original body if status code is 500 and flag is true', async () => {

      const res = await errorHandlerFalse.handle({ ...response, status: 500 }).toPromise();
      expect(res.body).toEqual(`Internal Server Error`);

    });

    it('should return an Unexpected Error error message with the original body if status code is incorrect and flag is true', async () => {

      const res = await errorHandlerTrue.handle({ ...response, status: 409 }).toPromise();
      expect(res.body).toEqual(`An Unexpected Error Occured: ${response.body}`);

    });

    it('should return an An Unexpected Error Occured Error error message without the original body if status code is incorrect and flag is true', async () => {

      const res = await errorHandlerFalse.handle({ ...response, status: 409 }).toPromise();
      expect(res.body).toEqual(`An Unexpected Error Occured`);

    });

    it('should do nothin if status is 200', async () => {

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
