/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/unbound-method */
import { Handler } from '@useid/handlersjs-core';
import { lastValueFrom, of } from 'rxjs';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerController } from '../models/http-handler-controller';
import { HttpHandlerRoute } from '../models/http-handler-route';
import { RoutedHttpRequestHandler } from './routed-http-request.handler';

const getMockedHttpHandler = (): HttpHandler => ({
  handle: jest.fn().mockReturnValue(of({ status: 200, headers: {} })),
});

const getMockedHttpHandlerAndRoute = (route: string): { handler: HttpHandler; route: HttpHandlerRoute } => {

  const operations = [ { method: 'GET', publish: true } ];
  const handler = getMockedHttpHandler();

  return { handler, route: { path: route, operations, handler } };

};

const getMockPreresponseHandler: () => Handler<HttpHandlerContext, HttpHandlerContext> = () => ({
  handle: jest.fn().mockImplementation((input) => of(input)),
});

describe('RoutedHttpRequestHandler', () => {

  let routedHttpRequestHandler: RoutedHttpRequestHandler;
  let handlerControllerList: HttpHandlerController[];
  let mockHttpHandler: HttpHandler;
  let preresponseHandler: Handler<HttpHandlerContext, HttpHandlerContext>;

  const vary = [ 'Accept', 'Authorization', 'Origin' ];

  beforeEach(() => {

    mockHttpHandler = getMockedHttpHandler();
    preresponseHandler = getMockPreresponseHandler();

    handlerControllerList = [
      {
        label: '1',
        preResponseHandler: preresponseHandler,
        routes: [ {
          operations: [ {
            method: 'GET',
            publish: true,
            vary,
          }, {
            method: 'OPTIONS',
            publish: false,
          } ],
          path: '/path1',
          handler: mockHttpHandler,
        } ],
      },
      {
        label: '2',
        routes: [ {
          operations: [ {
            method: 'POST',
            publish: true,
          },
          {
            method: 'PUT',
            publish: true,
          } ],
          path: '/path2',
          handler: mockHttpHandler,
        } ],
      },
    ];

    routedHttpRequestHandler = new RoutedHttpRequestHandler(handlerControllerList);

  });

  it('should instantiate correctly when passed correct HttpHandlerController[]', () => {

    expect(routedHttpRequestHandler).toBeTruthy();

  });

  it('should throw an error when calling constructor with null', () => {

    expect(() => new RoutedHttpRequestHandler((null as unknown as HttpHandlerController<HttpHandlerContext>[]))).toThrow('handlerControllerList must be defined.');

  });

  it('should throw an error when calling constructor with undefined', () => {

    expect(() => new RoutedHttpRequestHandler((undefined as unknown as HttpHandlerController<HttpHandlerContext>[]))).toThrow('handlerControllerList must be defined.');

  });

  describe('handle', () => {

    it('should call the handle function of the handler in the HttpHandlerRoute when the requested route exists', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path1', 'http://example.com'), method: 'GET', headers: {} },
      };

      await lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      expect(mockHttpHandler.handle).toHaveBeenCalledTimes(1);

    });

    it('should return a 404 response when the path does not exist and no default handler exists', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/nonExistantPath', 'http://example.com'), method: 'GET', headers: {} },
      };

      // the default handler (2nd parameter) is not required. Passing undefined to make it clear for
      // this test it does not exist so the error response is created.
      const handler = new RoutedHttpRequestHandler(handlerControllerList, undefined);

      await expect(lastValueFrom(handler.handle(httpHandlerContext)))
        .resolves.toEqual(expect.objectContaining({ status: 404 }));

    });

    it('should return a 405 response when the path exists, but the method does not match', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path2', 'http://example.com'), method: 'GET', headers: {} },
      };

      const response = lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      await expect(response).resolves.toEqual(expect.objectContaining({ status: 405 }));
      await expect(response).resolves.toEqual(expect.objectContaining({ headers: { Allow: 'POST, PUT' } }));

    });

    it('should return a 204 No Content response on an OPTIONS request', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path2', 'http://example.com'), method: 'OPTIONS', headers: {} },
      };

      const response = lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      await expect(response).resolves.toEqual(expect.objectContaining({ status: 204 }));
      await expect(response).resolves.toEqual(expect.objectContaining({ headers: { Allow: 'POST, PUT' } }));

    });

    it('should parse url parameters correctly', async () => {

      const { handler: oneDynamicHandler, route: oneDynamicRoute } = getMockedHttpHandlerAndRoute('/one/:dynamic');
      const { handler: dynamicOneHandler, route: dynamicOneRoute } = getMockedHttpHandlerAndRoute('/:dynamic/one');
      const { handler: neverHandler, route: neverRoute } = getMockedHttpHandlerAndRoute('/never');

      routedHttpRequestHandler = new RoutedHttpRequestHandler([
        { label: 'testRoutes', routes: [ oneDynamicRoute, dynamicOneRoute, neverRoute ] },
      ]);

      const pathsAndRoutes = {
        '/one/dynamicParam': oneDynamicHandler,
        '/dynamicParam/one': dynamicOneHandler,
      };

      Object.keys(pathsAndRoutes).forEach(async (key) => {

        const ctx: HttpHandlerContext = { request: { url: new URL(key, 'http://example.com'), method: 'GET', headers: {} } };
        await lastValueFrom(routedHttpRequestHandler.handle(ctx));

      });

      Object.entries(pathsAndRoutes).forEach(([ key, value ]) => {

        expect(value.handle).toHaveBeenCalledTimes(1);

        expect(value.handle).toHaveBeenCalledWith(
          expect.objectContaining({
            request: {
              parameters: { dynamic: 'dynamicParam' },
              headers: {},
              url: new URL(key, 'http://example.com'),
              method: 'GET',
            },
          }),
        );

      });

      expect(neverHandler.handle).toHaveBeenCalledTimes(0);

    });

    it('should call the right handler depending on the path', async () => {

      const { handler: oneHandler, route: oneRoute } = getMockedHttpHandlerAndRoute('/one');
      const { handler: twoHandler, route: twoRoute } = getMockedHttpHandlerAndRoute('/two');
      const { handler: nestedOneHandler, route: nestedOneRoute } = getMockedHttpHandlerAndRoute('/nested/one');
      const { handler: nestedNestedOneHandler, route: nestedNestedOneRoute } = getMockedHttpHandlerAndRoute('/nested/nested/one');
      const { handler: nestedTwoHandler, route: nestedTwoRoute } = getMockedHttpHandlerAndRoute('/nested/two');
      const { handler: oneDynamicHandler, route: oneDynamicRoute } = getMockedHttpHandlerAndRoute('/one/:dynamic');
      const { handler: dynamicOneHandler, route: dynamicOneRoute } = getMockedHttpHandlerAndRoute('/:dynamic/one');
      const { handler: neverHandler, route: neverRoute } = getMockedHttpHandlerAndRoute('/never');

      routedHttpRequestHandler = new RoutedHttpRequestHandler([
        {
          label: 'testRoutes',
          routes: [
            oneRoute,
            twoRoute,
            nestedOneRoute,
            nestedNestedOneRoute,
            nestedTwoRoute,
            oneDynamicRoute,
            dynamicOneRoute,
            neverRoute,
          ],
        },
      ]);

      const pathsAndRoutes = {
        '/one': oneHandler,
        '/two': twoHandler,
        '/nested/one': nestedOneHandler,
        '/nested/nested/one': nestedNestedOneHandler,
        '/nested/two': nestedTwoHandler,
        '/one/dynamicParam': oneDynamicHandler,
        '/dynamicParam/one': dynamicOneHandler,
      };

      Object.keys(pathsAndRoutes).forEach(async (key) => {

        const ctx: HttpHandlerContext = { request: { url: new URL(key, 'http://example.com'), method: 'GET', headers: {} } };
        await lastValueFrom(routedHttpRequestHandler.handle(ctx));

      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(pathsAndRoutes).forEach(([ key, value ]) => {

        expect(value.handle).toHaveBeenCalledTimes(1);

      });

      expect(neverHandler.handle).toHaveBeenCalledTimes(0);

    });

    it('should call the preresponse handler if present', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path1', 'http://example.com'), method: 'GET', headers: {} },
      };

      await lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      expect(preresponseHandler.handle).toHaveBeenCalledTimes(1);
      expect(mockHttpHandler.handle).toHaveBeenCalledTimes(1);

    });

    it('should pass the original context to the handler when the preResponseHandler does nothing', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path1', 'http://example.com'), method: 'GET', headers: {} },
      };

      await lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      expect(preresponseHandler.handle).toHaveBeenCalledTimes(1);

      expect(preresponseHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({ request: httpHandlerContext.request }),
      );

      expect(mockHttpHandler.handle).toHaveBeenCalledTimes(1);

      expect(mockHttpHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({ request: httpHandlerContext.request }),
      );

    });

    it('should add allow headers to the response when request method is OPTIONS', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path1', 'http://example.com'), method: 'OPTIONS', headers: {} },
      };

      const response = await lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      expect(response.headers).toEqual(expect.objectContaining({ Allow: 'GET, OPTIONS' }));

    });

    it('should call handle of the defaultHandler when no route is matched', async () => {

      const defaultHandler: HttpHandler = {
        handle: jest.fn().mockReturnValueOnce(of({ body: 'defaultHandler mockBody', headers: {}, status: 200 })),
      };

      const defaultRoutedHttpRequestHandler = new RoutedHttpRequestHandler(handlerControllerList, defaultHandler);

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/pathWontMatch', 'http://example.com'), method: 'GET', headers: {} },
      };

      await expect(lastValueFrom(defaultRoutedHttpRequestHandler.handle(httpHandlerContext))).resolves.toEqual({ body: 'defaultHandler mockBody', headers: {}, status: 200 });
      expect(defaultHandler.handle).toHaveBeenCalledTimes(1);

    });

    it('should not add vary header by default', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path2', 'http://example.com'), method: 'POST', headers: {} },
      };

      const response = await lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      expect(response.headers.vary).toBeUndefined();

    });

    it('should add vary header to the response when specified in the matched route', async () => {

      const httpHandlerContext: HttpHandlerContext = {
        request: { url: new URL('/path1', 'http://example.com'), method: 'GET', headers: {} },
      };

      const response = await lastValueFrom(routedHttpRequestHandler.handle(httpHandlerContext));

      expect(response.headers).toEqual(expect.objectContaining({ 'vary': vary.join(', ') }));

    });

  });

});
