import { HttpHandler } from './http-handler';
import { HttpHandlerContext } from './http-handler-context';
import { HttpHandlerOperation, HttpHandlerOperationHeader, HttpHandlerOperationMedia, HttpHandlerOperationMediaPayload, HttpHandlerOperationResponse, HttpHandlerRoute } from './http-handler-route';

describe('HttpHandlerRoute', () => {

  describe('HttpHanndlerOperationMediaPayload', () => {

    it('should be instantiated correctly', () => {

      class testClass extends HttpHandlerOperationMediaPayload { }
      const object = new testClass();

      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

  describe('HttpHandlerOperationMedia', () => {

    it('should be instantiated correctly', () => {

      class testClass extends HttpHandlerOperationMedia { }
      const object = new testClass('type');

      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

  describe('HttpHandlerOperationHeader', () => {

    it('should be instantiated correctly', () => {

      class testClass extends HttpHandlerOperationHeader { }
      const object = new testClass('type', 'description');

      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

  describe('HttpHandlerOperationResponse', () => {

    it('should be instantiated correctly', () => {

      class testClass extends HttpHandlerOperationResponse { }
      const object = new testClass(200);

      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

  describe('HttpHandlerOperation', () => {

    it('should be instantiated correctly', () => {

      class testClass extends HttpHandlerOperation { }
      const object = new testClass('method', true);

      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

  describe('HttpHandlerRoute', () => {

    class testClass extends HttpHandlerRoute { }

    it('should be instantiated correctly', () => {

      const object = new testClass((undefined as unknown as HttpHandlerOperation[]), 'path', (undefined as unknown as HttpHandler<HttpHandlerContext>));

      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

});
