import { of } from 'rxjs';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { HttpHandlerContext } from '../models/http-handler-context';
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

  const nestedHttpHandler = {
    canHandle: jest.fn().mockReturnValue(of(true)),
    handle: jest.fn().mockReturnValue(of(response)),
    safeHandle: jest.fn().mockReturnValue(of(response)),
  };

  const errorHandlerTrue = new ErrorHandler(nestedHttpHandler, true);
  const errorHandlerFalse = new ErrorHandler(nestedHttpHandler);

  const corsHandler = new HttpCorsRequestHandler(errorHandlerTrue);

  it('should be instantiated correctly', () => {

    expect(errorHandlerTrue).toBeTruthy();

  });

  it('should error when no nested handler was received', async () => {

    await expect(new ErrorHandler(null)).toThrow('A HttpHandler must be provided');
    await expect(new ErrorHandler(undefined)).toThrow('A HttpHandler must be provided');

  });

  describe('handler', () => {

    it.each`
    handler             | resp                                  | expected
    ${errorHandlerTrue} | ${{ ...response, status: undefined }} | ${`The server could not process the request due to an unknown error:\n${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: undefined }} | ${`The server could not process the request due to an unknown error`}
    ${errorHandlerTrue} | ${response}                           | ${`Bad Request: ${response.body}`}
    ${errorHandlerFalse}| ${response}                           | ${`Bad Request`}
    ${errorHandlerTrue} | ${{ ...response, status: 401 }}       | ${`Unauthorized: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 401 }}       | ${`Unauthorized`}
    ${errorHandlerTrue} | ${{ ...response, status: 402 }}       | ${`Payment Required: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 402 }}       | ${`Payment Required`}
    ${errorHandlerTrue} | ${{ ...response, status: 403 }}       | ${`Forbidden: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 403 }}       | ${`Forbidden`}
    ${errorHandlerTrue} | ${{ ...response, status: 404 }}       | ${`Not Found: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 404 }}       | ${`Not Found`}
    ${errorHandlerTrue} | ${{ ...response, status: 405 }}       | ${`Method Not Allowed: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 405 }}       | ${`Method Not Allowed`}
    ${errorHandlerTrue} | ${{ ...response, status: 406 }}       | ${`Not Acceptable: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 406 }}       | ${`Not Acceptable`}
    ${errorHandlerTrue} | ${{ ...response, status: 407 }}       | ${`Proxy Authentication Required: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 407 }}       | ${`Proxy Authentication Required`}
    ${errorHandlerTrue} | ${{ ...response, status: 408 }}       | ${`Request Timeout: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 408 }}       | ${`Request Timeout`}
    ${errorHandlerTrue} | ${{ ...response, status: 409 }}       | ${`Conflict: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 409 }}       | ${`Conflict`}
    ${errorHandlerTrue} | ${{ ...response, status: 410 }}       | ${`Gone: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 410 }}       | ${`Gone`}
    ${errorHandlerTrue} | ${{ ...response, status: 411 }}       | ${`Length Required: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 411 }}       | ${`Length Required`}
    ${errorHandlerTrue} | ${{ ...response, status: 412 }}       | ${`Precondition Failed: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 412 }}       | ${`Precondition Failed`}
    ${errorHandlerTrue} | ${{ ...response, status: 413 }}       | ${`Payload Too Large: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 413 }}       | ${`Payload Too Large`}
    ${errorHandlerTrue} | ${{ ...response, status: 414 }}       | ${`URI Too Long: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 414 }}       | ${`URI Too Long`}
    ${errorHandlerTrue} | ${{ ...response, status: 415 }}       | ${`Unsupported Media Type: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 415 }}       | ${`Unsupported Media Type`}
    ${errorHandlerTrue} | ${{ ...response, status: 416 }}       | ${`Range Not Satisfiable: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 416 }}       | ${`Range Not Satisfiable`}
    ${errorHandlerTrue} | ${{ ...response, status: 417 }}       | ${`Expectation Failed: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 417 }}       | ${`Expectation Failed`}
    ${errorHandlerTrue} | ${{ ...response, status: 418 }}       | ${`I'm a teapot: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 418 }}       | ${`I'm a teapot`}
    ${errorHandlerTrue} | ${{ ...response, status: 421 }}       | ${`Misdirected Request: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 421 }}       | ${`Misdirected Request`}
    ${errorHandlerTrue} | ${{ ...response, status: 422 }}       | ${`Unprocessable Entity: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 422 }}       | ${`Unprocessable Entity`}
    ${errorHandlerTrue} | ${{ ...response, status: 423 }}       | ${`Locked: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 423 }}       | ${`Locked`}
    ${errorHandlerTrue} | ${{ ...response, status: 424 }}       | ${`Failed Dependency: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 424 }}       | ${`Failed Dependency`}
    ${errorHandlerTrue} | ${{ ...response, status: 425 }}       | ${`Too Early: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 425 }}       | ${`Too Early`}
    ${errorHandlerTrue} | ${{ ...response, status: 426 }}       | ${`Upgrade Required: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 426 }}       | ${`Upgrade Required`}
    ${errorHandlerTrue} | ${{ ...response, status: 428 }}       | ${`Precondition required: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 428 }}       | ${`Precondition required`}
    ${errorHandlerTrue} | ${{ ...response, status: 429 }}       | ${`Too Many Requests: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 429 }}       | ${`Too Many Requests`}
    ${errorHandlerTrue} | ${{ ...response, status: 431 }}       | ${`Request Header Fields Too Large: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 431 }}       | ${`Request Header Fields Too Large`}
    ${errorHandlerTrue} | ${{ ...response, status: 451 }}       | ${`Unavailable For Legal Reasons: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 451 }}       | ${`Unavailable For Legal Reasons`}
    ${errorHandlerTrue} | ${{ ...response, status: 500 }}       | ${`Internal Server Error: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 500 }}       | ${`Internal Server Error`}
    ${errorHandlerTrue} | ${{ ...response, status: 501 }}       | ${`Not Implemented: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 501 }}       | ${`Not Implemented`}
    ${errorHandlerTrue} | ${{ ...response, status: 502 }}       | ${`Bad Gateway: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 502 }}       | ${`Bad Gateway`}
    ${errorHandlerTrue} | ${{ ...response, status: 503 }}       | ${`Service Unavailable: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 503 }}       | ${`Service Unavailable`}
    ${errorHandlerTrue} | ${{ ...response, status: 504 }}       | ${`Gateway Timeout: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 504 }}       | ${`Gateway Timeout`}
    ${errorHandlerTrue} | ${{ ...response, status: 505 }}       | ${`HTTP Version Not Supported: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 505 }}       | ${`HTTP Version Not Supported`}
    ${errorHandlerTrue} | ${{ ...response, status: 506 }}       | ${`Variant Also Negotiates: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 506 }}       | ${`Variant Also Negotiates`}
    ${errorHandlerTrue} | ${{ ...response, status: 507 }}       | ${`Insufficient Storage: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 507 }}       | ${`Insufficient Storage`}
    ${errorHandlerTrue} | ${{ ...response, status: 508 }}       | ${`Loop detected: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 508 }}       | ${`Loop detected`}
    ${errorHandlerTrue} | ${{ ...response, status: 510 }}       | ${`Not Extended: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 510 }}       | ${`Not Extended`}
    ${errorHandlerTrue} | ${{ ...response, status: 511 }}       | ${`Network Authentication Required: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 511 }}       | ${`Network Authentication Required`}
    ${errorHandlerTrue} | ${{ ...response, status: 555 }}       | ${`An Unexpected Error Occurred: ${response.body}`}
    ${errorHandlerFalse}| ${{ ...response, status: 555 }}       | ${`An Unexpected Error Occurred`}
  `('should return $expected when handler is $a and response is $b', async ({ handler, resp, expected }) => {

      const res = await handler.handle(resp).toPromise();
      expect(res.body).toEqual(expected);

    });

    it('should do nothing if status is 200', async () => {

      const res = await errorHandlerFalse.handle(context).toPromise();
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

    it('should return true when context is received', async () => {

      await expect(errorHandlerTrue.canHandle(context).toPromise()).resolves.toEqual(true);

    });

    it('should return false when response is not received', async () => {

      await expect(errorHandlerTrue.canHandle(undefined).toPromise()).resolves.toEqual(false);
      await expect(errorHandlerTrue.canHandle(null).toPromise()).resolves.toEqual(false);

    });

  });

});
