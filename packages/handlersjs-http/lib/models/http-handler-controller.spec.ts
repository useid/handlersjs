import { HttpHandlerController } from './http-handler-controller';

describe('HttpHandlerRoute', () => {

  describe('HttpHandlerController', () => {

    it('should be instantiated correctly', () => {

      class testClass extends HttpHandlerController { }
      const object = new testClass('label', undefined);
      expect(object).toBeDefined();
      expect(object).toBeTruthy();

    });

  });

});
