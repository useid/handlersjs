import { HttpHandlerError } from './http-handler-error';

describe('HttpHandlerRoute', () => {

  describe('HttpHandlerError', () => {

    it('should be instantiated correctly', () => {

      const error = new HttpHandlerError('label', undefined, undefined);

      expect(error).toBeDefined();
      expect(error).toBeTruthy();

    });

  });

});
