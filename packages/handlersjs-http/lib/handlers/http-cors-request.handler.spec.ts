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
  const mockResponseHeaders = { someHeader: 'headerSome' };

  beforeEach(() => {
    handler = {
      handle: jest.fn().mockReturnValue(of({ headers: mockResponseHeaders, status: 200 } as HttpHandlerResponse)),
      safeHandle: jest.fn(),
      canHandle: jest.fn().mockReturnValue(of(true)),
    };
    context = {
      request: {
        url: new URL('http://example.com'),
        method: 'GET',
        headers: {
          accEPt: 'text/plain',
          origin: 'testing',
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
        expect(response).toEqual(expect.objectContaining({ headers: { ...mockResponseHeaders, 'Access-Control-Allow-Origin': '*' } }));
      });

      // Basic preflight flow
      it('should return the right headers and status in the response when no special options were passed to the constructor', async() => {
        context.request.method = 'OPTIONS';
        const response = await service.handle(context).toPromise();
        expect(response).toEqual(expect.objectContaining({ headers: { 'access-control-allow-methods': 'GET, HEAD, PUT, POST, DELETE, PATCH', 'access-control-allow-origin': '*', 'access-control-max-age': '-1'} }));
        expect(response).toEqual(expect.objectContaining({ status: 204 }));
      });
    });
  });
});

