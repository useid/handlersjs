import { of } from 'rxjs';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { HttpCorsRequestHandler } from './http-cors-request.handler';

const filterOutCORSHeaders = (c: HttpHandlerContext): HttpHandlerContext => ({
  ...c,
  request: {
    ...c.request,
    headers: {
      ...Object.keys(c.request.headers).reduce<{ [key: string]: string }>(
        (acc, key) => {
          const corsHeaders = [ 'origin', 'access-control-request-method', 'access-control-request-headers' ];
          const lKey = key.toLowerCase();
          return !corsHeaders.includes(lKey)
            ? { ...acc, [key]: c.request.headers[key]}
            : { ...acc };
        }, {} as { [key: string]: string },
      ),
    },
  },
});
const makeHeaderKeysLowerCase = (c: HttpHandlerContext): HttpHandlerContext => ({
  ...c,
  request: {
    ...c.request,
    headers: {
      ...Object.keys(c.request.headers).reduce<{ [key: string]: string }>((acc, key) =>
        ({ ...acc, [key.toLowerCase()]: c.request.headers[key]}), {} as { [key: string]: string }),
    },
  },
});

describe('HttpCorsRequestHandler', () => {

  let service: HttpCorsRequestHandler;
  let handler: HttpHandler;
  let context: HttpHandlerContext;
  const mockResponseHeaders = { 'some-header': 'headerSome' };

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
          accEPt: 'text/plain',
          origin: 'http://test.de',
        },
      },
    };
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
        await service.handle(context).toPromise();
        expect(handler.handle).toHaveBeenCalledTimes(1);
        const expectedToBeCalledWith = makeHeaderKeysLowerCase(filterOutCORSHeaders(context));
        expect(handler.handle).toHaveBeenCalledWith(expectedToBeCalledWith);
      });

      // Basic CORS flow
      it('should return the right headers in the response when no special options were passed to the constructor', async() => {
        const response = await service.handle(context).toPromise();
        expect(handler.handle).toHaveBeenCalledTimes(1);
        expect(response).toEqual(expect.objectContaining({ headers: { ...mockResponseHeaders, 'Access-Control-Allow-Origin': '*' } }));
      });

      // Basic preflight flow
      it('should return the right headers and status in the response when no special options were passed to the constructor', async() => {
        context.request.method = 'OPTIONS';
        const response = await service.handle(context).toPromise();
        expect(handler.handle).toHaveBeenCalledTimes(0);
        expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Max-Age': '-1' }));
        expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Allow-Origin': '*' }));
        expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Allow-Methods': 'GET, HEAD, PUT, POST, DELETE, PATCH'  }));
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
      expect(response).toEqual(expect.objectContaining({ body: 'handler done' }));
      expect(response).toEqual(expect.objectContaining({ status: 200 }));
      expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Max-Age': '-1' }));
      expect(response.headers).toEqual(expect.objectContaining({ ...mockResponseHeaders }));
      expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Allow-Origin': '*' }));
      expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Allow-Methods': 'GET, HEAD, PUT, POST, DELETE, PATCH' }));
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
      expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Allow-Origin': 'http://test.de' }));
      expect(response.headers).toEqual(expect.objectContaining({ 'Vary': 'Origin' }));
      expect(response.headers).toEqual(expect.objectContaining({ ...mockResponseHeaders }));
    });

    it('should return the right headers, body and status in the response when no special options were passed to the constructor', async() => {
      context.request.method = 'OPTIONS';
      const response = await service.handle(context).toPromise();
      expect(response.headers).toEqual(expect.objectContaining({ ...mockResponseHeaders }));
      expect(response.headers).toEqual(expect.objectContaining({ 'Vary': 'Origin' }));
      expect(response).toEqual(expect.objectContaining({ status: 200 }));
      expect(response).toEqual(expect.objectContaining({ body: 'handler done' }));
    });

    it('should return a \'access-control-allow-credentials\' header set to \'true\'', async() => {
      service = new HttpCorsRequestHandler(handler, {
        origins: [ 'http://text.com', 'http://test.de' ],
        allowMethods: [], allowHeaders: [],
        credentials: true, maxAge: 2,
      }, true);
      const response = await service.handle(context).toPromise();
      expect(response.headers).toEqual(expect.objectContaining({ 'Access-Control-Allow-Credentials': 'true' }));
      expect(response.headers).toEqual(expect.objectContaining({ 'Vary': 'Origin' }));
      expect(response.headers).toEqual(expect.objectContaining({ ...mockResponseHeaders }));
      expect(response).toEqual(expect.objectContaining({ status: 200 }));
      expect(response).toEqual(expect.objectContaining({ body: 'handler done' }));
    });
  });
});

