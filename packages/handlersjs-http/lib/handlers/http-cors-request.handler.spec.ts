import { of } from 'rxjs';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { cleanHeaders } from '../util/clean-headers';
import { HttpCorsOptions, HttpCorsRequestHandler } from './http-cors-request.handler';

describe('HttpCorsRequestHandler', () => {

  let service: HttpCorsRequestHandler;
  let handler: HttpHandler;
  let context: HttpHandlerContext;
  const mockResponseHeaders = { 'some-header': 'headerSome' };

  const mockOptions: HttpCorsOptions = {
    origins: [ 'http://text.com', 'http://test.de' ],
    allowMethods: [ 'GET', 'POST' ],
    allowHeaders: [],
    credentials: false,
    maxAge: 2,
  };

  beforeEach(() => {

    handler = {
      handle: jest.fn().mockReturnValue(of({ headers: mockResponseHeaders, status: 200, body: 'handler done' } as HttpHandlerResponse)),
      safeHandle: jest.fn(),
      canHandle: jest.fn().mockReturnValue(of(true)),
    };

    context = {
      request: {
        url: new URL('http://example.com'),
        method: 'GET',
        headers: {
          accept: 'text/plain',
          origin: 'http://test.de',
        },
      },
    };

  });

  it('should be correctly instantiated', () => {

    expect(new HttpCorsRequestHandler(handler)).toBeTruthy();
    expect(new HttpCorsRequestHandler(handler, undefined)).toBeTruthy();
    expect(new HttpCorsRequestHandler(handler, mockOptions)).toBeTruthy();

    // cover the optional abstract parameters
    class t extends HttpCorsOptions {}
    new t();

  });

  describe('basic tests', () => {

    beforeEach(() => {

      service = new HttpCorsRequestHandler(handler);

    });

    it('should be correctly instantiated', () => {

      expect(service).toBeTruthy();

    });

    describe('canHandle()', () => {

      it('should always return true', async() => {

        await expect(service.canHandle(undefined).toPromise()).resolves.toBe(true);

      });

    });

    describe('handle()', () => {

      // Check 'noCorsRequestContext' and 'cleanHeaders'
      it('should not pass CORS headers to the child handler.handle and all headers must be lower case', async() => {

        delete context.request.headers.origin;
        await service.handle(context).toPromise();
        expect(handler.handle).toHaveBeenCalledTimes(1);
        const expectedToBeCalledWith = { ...context, request: { headers:  cleanHeaders(context.request.headers), method: 'GET', url: new URL('http://example.com') } };

        expect(handler.handle).toHaveBeenCalledWith(expectedToBeCalledWith);

      });

      // Basic CORS flow
      it('should return the right headers in the response when no special options were passed to the constructor', async() => {

        const response = await service.handle(context).toPromise();
        expect(handler.handle).toHaveBeenCalledTimes(1);
        expect(response).toEqual(expect.objectContaining({ headers: { ...mockResponseHeaders, 'access-control-allow-origin': '*' } }));

      });

      // Basic preflight flow
      it('should return the right headers and status in the response when no special options were passed to the constructor', async() => {

        context.request.method = 'OPTIONS';
        const response = await service.handle(context).toPromise();
        expect(handler.handle).toHaveBeenCalledTimes(0);
        expect(response.headers).toEqual(expect.objectContaining({ 'access-control-max-age': '-1', 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, HEAD, PUT, POST, DELETE, PATCH' }));
        expect(response).toEqual(expect.objectContaining({ status: 204 }));

      });

    });

  });

  describe('Preflight using nested handler', () => {

    beforeEach(() => {

      service = new HttpCorsRequestHandler(handler, {}, true);

    });

    it('should return a response with the body set by the nested handler', async() => {

      context.request.method = 'OPTIONS';
      const response = await service.handle(context).toPromise();
      expect(handler.handle).toHaveBeenCalledTimes(1);
      expect(response).toEqual(expect.objectContaining({ body: 'handler done', status: 200 }));

      expect(response.headers).toEqual(
        expect.objectContaining({
          ...mockResponseHeaders,
          'access-control-max-age': '-1',
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, HEAD, PUT, POST, DELETE, PATCH',
        })
      );

    });

  });

  describe('Using passthrough options', () => {

    beforeEach(() => {

      service = new HttpCorsRequestHandler(handler, {
        origins: [ 'http://text.com', 'http://test.de' ],
        allowMethods: [ 'GET', 'POST' ],
        allowHeaders: [],
        credentials: false,
        maxAge: 2,
      }, true);

    });

    it('should return the right headers in the response when no special options were passed to the constructor', async() => {

      const response = await service.handle(context).toPromise();
      expect(response.headers).toEqual(expect.objectContaining({ 'access-control-allow-origin': 'http://test.de', 'vary': 'origin', ...mockResponseHeaders  }));

    });

    it('should return the right headers, body and status in the response when no special options were passed to the constructor', async() => {

      context.request.method = 'OPTIONS';
      const response = await service.handle(context).toPromise();
      expect(response.headers).toEqual(expect.objectContaining({ ...mockResponseHeaders, 'vary': 'origin' }));
      expect(response).toEqual(expect.objectContaining({ status: 200, body: 'handler done' }));

    });

    it(`should return a 'access-control-allow-credentials' header set to 'true'`, async() => {

      service = new HttpCorsRequestHandler(handler, {
        origins: [ 'http://text.com', 'http://test.de' ],
        allowMethods: [], allowHeaders: [],
        credentials: true, maxAge: 2,
      }, true);

      const response = await service.handle(context).toPromise();
      expect(response.headers).toEqual(expect.objectContaining({ 'access-control-allow-credentials': 'true',  'vary': 'origin', ...mockResponseHeaders }));
      expect(response).toEqual(expect.objectContaining({ status: 200, body: 'handler done'  }));

    });

  });

});

