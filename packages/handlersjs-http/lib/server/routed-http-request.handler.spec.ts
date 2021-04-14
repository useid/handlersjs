import { HttpHandler } from '../general/http-handler';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandlerController } from '../general/http-handler-controller';
import { HttpHandlerRequest } from '../general/http-handler-request';
import { HttpHandlerRoute } from '../general/http-handler-route';
import { RoutedHttpRequestHandler } from './routed-http-request.handler';

describe('RoutedHttpRequestHandler', () => {
  let routedHttpRequestHandler: RoutedHttpRequestHandler;
  let handlerControllerList: HttpHandlerController[];
  let mockHttpHandler: HttpHandler;
  let helper;

  beforeEach(() => {
    helper = {
      handle: jest.fn(),
      canHandle: jest.fn(),
      safeHandle: jest.fn(),
    };
    mockHttpHandler = { ...helper };

    handlerControllerList = [
      {
        label: '1',
        routes: [ {
          operations: [ {
            method: 'GET',
            publish: true,
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
    expect(() => new RoutedHttpRequestHandler(null)).toThrow('handlerControllerList must be defined.');
  });

  it('should throw an error when calling constructor with undefined', () => {
    expect(() => new RoutedHttpRequestHandler(undefined)).toThrow('handlerControllerList must be defined.');
  });

  describe('handle', () => {
    it('should call the handle function of the handler in the HttpHandlerRoute when the requested route exists', async () => {
      const httpHandlerContext: HttpHandlerContext = {
        request: { path: '/path1', method: 'GET', headers: {} },
      };
      await routedHttpRequestHandler.handle(httpHandlerContext);
      expect(mockHttpHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should return a 404 response when the path does not exist', async () => {
      const httpHandlerContext: HttpHandlerContext = {
        request: { path: '/nonExistantPath', method: 'GET', headers: {} },
      };
      await expect(routedHttpRequestHandler.handle(httpHandlerContext).toPromise())
        .resolves.toEqual(expect.objectContaining({ status: 404 }));
    });

    it('should return a 404 response when the path exists, but the method does not match ', async () => {
      const httpHandlerContext: HttpHandlerContext = {
        request: { path: '/path2', method: 'GET', headers: {} },
      };
      await expect(routedHttpRequestHandler.handle(httpHandlerContext).toPromise())
        .resolves.toEqual(expect.objectContaining({ status: 404 }));
    });

    it('should throw an error when called with null or undefined', async () => {
      await expect(routedHttpRequestHandler.handle(null).toPromise())
        .rejects.toThrow('input must be defined.');

      await expect(routedHttpRequestHandler.handle(undefined).toPromise())
        .rejects.toThrow('input must be defined.');
    });

    it('should throw an error when called with a request that is null or undefined', async () => {
      const httpHandlerContext1: HttpHandlerContext = {
        request: null,
      };

      await expect(routedHttpRequestHandler.handle(httpHandlerContext1).toPromise())
        .rejects.toThrow('input.request must be defined.');

      const httpHandlerContext2: HttpHandlerContext = {
        request: undefined,
      };

      await expect(routedHttpRequestHandler.handle(httpHandlerContext2).toPromise())
        .rejects.toThrow('input.request must be defined.');
    });

    describe('right handler.handle is called and parse url- and query parameters correctly', () => {
      let blablaMockHandler: HttpHandler;
      let blablaRoute: HttpHandlerRoute;
      let blablablaMockHandler: HttpHandler;
      let blablablaRoute: HttpHandlerRoute;
      let blablablieMockHandler: HttpHandler;
      let blablablieRoute: HttpHandlerRoute;
      let blobloMockHandler: HttpHandler;
      let blobloRoute: HttpHandlerRoute;
      let bloblovarMockHandler: HttpHandler;
      let bloblovarRoute: HttpHandlerRoute;
      let blovarMockHandler: HttpHandler;
      let blovarRoute: HttpHandlerRoute;

      beforeEach(() => {
        const operations = [ { method: 'GET', publish: true,} ];

        blablaMockHandler = { ...helper };
        blablaRoute = { path: '/bla/bla', operations, handler: blablaMockHandler };
        blablablaMockHandler = { ...helper };
        blablablaRoute = { path: '/bla/bla/bla', operations, handler: blablablaMockHandler };
        blablablieMockHandler = { ...helper };
        blablablieRoute = { path: '/bla/bla/blie', operations, handler: blablablieMockHandler };
        blobloMockHandler = { ...helper };
        blobloRoute = { path: '/blo/blo', operations, handler: blobloMockHandler };
        bloblovarMockHandler = { ...helper };
        bloblovarRoute = { path: '/blo/blo/:var', operations, handler: bloblovarMockHandler };
        blovarMockHandler = { ...helper };
        blovarRoute = { path: '/blo/:var', operations, handler: blovarMockHandler };

        handlerControllerList = [
          {
            label: 'testRoutes',
            routes: [
              blablaRoute,
              blablablaRoute,
              blablablieRoute,
              blobloRoute,
              bloblovarRoute,
              blovarRoute,
            ],
          }
        ];

        routedHttpRequestHandler = new RoutedHttpRequestHandler(handlerControllerList);
      });

      it('path: /bla/bla', async () => {
        const path = '/bla/bla';
        const request: HttpHandlerRequest = { path, method: 'GET', headers: {} };
        const ctx: HttpHandlerContext = { request };
        await routedHttpRequestHandler.handle(ctx);
        expect(blablaMockHandler.handle).toHaveBeenCalledTimes(1);
        expect(blablaMockHandler.handle).toHaveBeenCalledWith({
          request: { ...request, parameters: {}, query: {}},
          route: blablaRoute,
        });
      });

      it('path: /bla/bla/bla', async () => {
        const path = '/bla/bla/bla';
        const request: HttpHandlerRequest = { path, method: 'GET', headers: {} };
        const ctx: HttpHandlerContext = { request };
        await routedHttpRequestHandler.handle(ctx);
        expect(blablaMockHandler.handle).toHaveBeenCalledTimes(1);
        expect(blablaMockHandler.handle).toHaveBeenCalledWith({
          request: { ...request, parameters: {}, query: {}},
          route: blablablaRoute,
        });
      });

      it('path: /bla/bla/blie', async () => {
        const path = '/bla/bla/blie';
        const request: HttpHandlerRequest = { path, method: 'GET', headers: {} };
        const ctx: HttpHandlerContext = { request };
        await routedHttpRequestHandler.handle(ctx);
        expect(blablaMockHandler.handle).toHaveBeenCalledTimes(1);
        expect(blablaMockHandler.handle).toHaveBeenCalledWith({
          request: { ...request, parameters: {}, query: {}},
          route: blablablieRoute,
        });
      });

      it('path: /blo/blo', async () => {
        const path = '/blo/blo';
        const request: HttpHandlerRequest = { path, method: 'GET', headers: {} };
        const ctx: HttpHandlerContext = { request };
        await routedHttpRequestHandler.handle(ctx);
        expect(blablaMockHandler.handle).toHaveBeenCalledTimes(1);
        expect(blablaMockHandler.handle).toHaveBeenCalledWith({
          request: { ...request, parameters: {}, query: {}},
          route: blobloRoute,
        });
      });

      it('path: /blo/blo/:var', async () => {
        const path = '/blo/blo/variable';
        const request: HttpHandlerRequest = { path, method: 'GET', headers: {} };
        const ctx: HttpHandlerContext = { request };
        await routedHttpRequestHandler.handle(ctx);
        expect(blablaMockHandler.handle).toHaveBeenCalledTimes(1);
        expect(blablaMockHandler.handle).toHaveBeenCalledWith({
          request: { ...request, parameters: { var: 'variable' }, query: {}},
          route: bloblovarRoute,
        });
      });

      it('path: /blo/:var', async () => {
        const path = '/kk';
        const request: HttpHandlerRequest = { path, method: 'GET', headers: {} };
        const ctx: HttpHandlerContext = { request };
        await routedHttpRequestHandler.handle(ctx);
        expect(blablaMockHandler.handle).toHaveBeenCalledTimes(1);
        expect(blablaMockHandler.handle).toHaveBeenCalledWith({
          request: { ...request, parameters: { var: 'variable' }, query: {}},
          route: blovarRoute,
        });
      });

      it('path: /blo/blo/:var?test=good&works=yes', async () => {
        const path = '/blo/blo/variable?test=good&works=yes';
        const request: HttpHandlerRequest = { path, method: 'GET', headers: {} };
        const ctx: HttpHandlerContext = { request };
        await routedHttpRequestHandler.handle(ctx);
        expect(blablaMockHandler.handle).toHaveBeenCalledTimes(1);
        expect(blablaMockHandler.handle).toHaveBeenCalledWith({
          request: { ...request, parameters: { var: 'variable' }, query: { test: 'good', works: 'yes' }},
          route: bloblovarRoute,
        });
      });
    });
  });

  describe('canHandle', () => {
    it ('should return true when context and request are defined', async () => {
      const httpHandlerContext: HttpHandlerContext = {
        request: { path: '/path1', method: 'GET', headers: {} },
      };
      await expect(routedHttpRequestHandler.canHandle(httpHandlerContext).toPromise()).resolves.toEqual(true);
    });

    it ('should return false when context is undefined or null', async () => {
      await expect(routedHttpRequestHandler.canHandle(null).toPromise()).resolves.toEqual(false);

      await expect(routedHttpRequestHandler.canHandle(undefined).toPromise()).resolves.toEqual(false);
    });

    it ('should return false when context.request is undefined or null', async () => {
      const httpHandlerContext1: HttpHandlerContext = {
        request: null,
      };
      await expect(routedHttpRequestHandler.canHandle(httpHandlerContext1).toPromise()).resolves.toEqual(false);

      const httpHandlerContext2: HttpHandlerContext = {
        request: undefined,
      };
      await expect(routedHttpRequestHandler.canHandle(httpHandlerContext2).toPromise()).resolves.toEqual(false);
    });
  });
});
