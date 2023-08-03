/* eslint-disable @typescript-eslint/unbound-method */
import { lastValueFrom, of } from 'rxjs';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
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
    };

    context = {
      request: {
        url: new URL('http://example.com'),
        method: 'GET',
        headers: {
          accept: 'text/plain',
          origin: 'http://test.de',
          ['access-control-request-method']: 'GET',
        },
      },
    };

  });

  it('should be correctly instantiated', () => {

    expect(new HttpCorsRequestHandler(handler)).toBeTruthy();
    expect(new HttpCorsRequestHandler(handler, undefined)).toBeTruthy();
    expect(new HttpCorsRequestHandler(handler, mockOptions)).toBeTruthy();

  });

  describe('basic tests', () => {

    beforeEach(() => {

      service = new HttpCorsRequestHandler(handler);

    });

    it('should be correctly instantiated', () => {

      expect(service).toBeTruthy();

    });

    describe('handle()', () => {

      // Check 'noCorsRequestContext' and 'cleanHeaders'
      it('should not pass CORS headers to the child handler.handle', async() => {

        await lastValueFrom(service.handle(context));

        expect(handler.handle).toHaveBeenCalledTimes(1);

        expect(handler.handle).toHaveBeenCalledWith(expect.objectContaining({
          request: expect.objectContaining({
            headers: {
              accept: context.request.headers.accept,
              origin: context.request.headers.origin,
            },
          }),
        }));

      });

      it('should set all headers to lower case', async() => {

        const noCorsHeaderContext = { ... context, request: { ... context.request, headers: { ACCEPT: 'text/plain' } } };
        await lastValueFrom(service.handle(noCorsHeaderContext));

        expect(handler.handle).toHaveBeenCalledTimes(1);

        expect(handler.handle).toHaveBeenCalledWith({ ... context, request: { ... context.request, headers: { accept: 'text/plain' } } });

      });

      // Basic CORS flow
      it('should return the right headers in the response when no special options were passed to the constructor', async() => {

        const response = await lastValueFrom(service.handle(context));

        expect(handler.handle).toHaveBeenCalledTimes(1);
        expect(response).toEqual(expect.objectContaining({ headers: { ... mockResponseHeaders, 'access-control-allow-origin': '*' } }));

      });

      // Basic preflight flow
      it('should return the right headers and status in the response when no special options were passed to the constructor', async() => {

        context.request.method = 'OPTIONS';
        const response = await lastValueFrom(service.handle(context));

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
      const response = await lastValueFrom(service.handle(context));

      expect(handler.handle).toHaveBeenCalledTimes(1);
      expect(response).toEqual(expect.objectContaining({ body: 'handler done', status: 200 }));

      expect(response.headers).toEqual(
        expect.objectContaining({
          ... mockResponseHeaders,
          'access-control-max-age': '-1',
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, HEAD, PUT, POST, DELETE, PATCH',
        }),
      );

    });

  });

  describe('Using passthrough options', () => {

    beforeEach(() => {

      service = new HttpCorsRequestHandler(handler, mockOptions, true);

    });

    it('should return the right headers in the response when no special options were passed to the constructor', async() => {

      const response = await lastValueFrom(service.handle(context));

      expect(response.headers).toEqual(expect.objectContaining({ 'access-control-allow-origin': 'http://test.de', 'vary': 'origin', ... mockResponseHeaders }));

    });

    it('should join the given expose headers in the response headers', async () => {

      mockOptions.exposeHeaders = [ 'Content-Encoding', 'X-Kuma-Revision' ];
      const response = await lastValueFrom(service.handle(context));

      expect(response.headers['access-control-expose-headers']).toBe('Content-Encoding,X-Kuma-Revision');

    });

    it('should return the right headers, body and status in the response when no special options were passed to the constructor', async() => {

      context.request.method = 'OPTIONS';
      const response = await lastValueFrom(service.handle(context));

      expect(response.headers).toEqual(expect.objectContaining({ ... mockResponseHeaders, 'vary': 'origin' }));
      expect(response).toEqual(expect.objectContaining({ status: 200, body: 'handler done' }));

    });

    it(`should return a 'access-control-allow-credentials' header set to 'true'`, async() => {

      service = new HttpCorsRequestHandler(handler, {
        origins: [ 'http://text.com', 'http://test.de' ],
        allowMethods: [], allowHeaders: [],
        credentials: true, maxAge: 2,
      }, true);

      const response = await lastValueFrom(service.handle(context));

      expect(response.headers).toEqual(expect.objectContaining({ 'access-control-allow-credentials': 'true', 'vary': 'origin', ... mockResponseHeaders }));
      expect(response).toEqual(expect.objectContaining({ status: 200, body: 'handler done' }));

    });

    it('should set access-control-allow-origin header to undefined if requested origin is not in the options origins', async () => {

      const handlerWithOptions = new HttpCorsRequestHandler(handler, mockOptions);

      context.request.method = 'OPTIONS';
      context.request.headers.origin = 'http://test.be';
      const response = await lastValueFrom(handlerWithOptions.handle(context));

      expect(response.headers['access-control-allow-origin']).toBeUndefined();

    });

    it('should set access-control-allow-origin header to requestedOrigin if no origins were provided in the options', async () => {

      mockOptions.origins = undefined;
      mockOptions.credentials = true;
      const handlerWithOptions = new HttpCorsRequestHandler(handler, mockOptions);

      context.request.method = 'OPTIONS';
      const response = await lastValueFrom(handlerWithOptions.handle(context));

      expect(response.headers['access-control-allow-origin']).toBe('http://test.de');

    });

    it('should join the given access-control-allow-headers in the response headers', async () => {

      service = new HttpCorsRequestHandler(handler, {
        origins: [ 'http://text.com', 'http://test.de' ],
        allowMethods: [], allowHeaders: [ 'X-Custom-Header', 'Upgrade-Insecure-Requests' ],
        credentials: true, maxAge: 2,
      }, true);

      context.request.method = 'OPTIONS';
      const response = await lastValueFrom(service.handle(context));

      expect(response.headers['access-control-allow-headers']).toBe('X-Custom-Header,Upgrade-Insecure-Requests');

    });

    it('should keep the vary header from its child handler', async () => {

      handler = {
        handle: jest.fn().mockReturnValue(of({ headers: { vary: 'accept, origin' }, status: 200, body: 'handler done' } as HttpHandlerResponse)),
      };

      service = new HttpCorsRequestHandler(handler, { credentials: true }, true);

      const response = await lastValueFrom(service.handle(context));

      expect(response.headers['access-control-allow-origin']).toEqual(context.request.headers.origin);
      expect(response.headers.vary).toBe('accept, origin');

      context.request.method = 'OPTIONS';
      const responseOptions = await lastValueFrom(service.handle(context));

      expect(responseOptions.headers['access-control-allow-origin']).toEqual(context.request.headers.origin);
      expect(responseOptions.headers.vary).toBe('accept, origin');

    });

  });

});

