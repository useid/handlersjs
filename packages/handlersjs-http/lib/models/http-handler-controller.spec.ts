import { HttpHandlerContext } from './http-handler-context';
import { HttpHandlerController } from './http-handler-controller';
import { HttpHandlerRoute } from './http-handler-route';

describe('HttpHandlerRoute', () => {

  describe('HttpHandlerController', () => {

    it('should be instantiated correctly', () => {

      class testClass extends HttpHandlerController { }
      const object = new testClass('label', (undefined as unknown as HttpHandlerRoute<HttpHandlerContext>[]));

      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

});
