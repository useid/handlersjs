import { HttpHandlerResponse } from '../models/http-handler-response';
import { HttpHandlerError } from './http-handler-error';

describe('HttpHandlerRoute', () => {

  describe('HttpHandlerError', () => {

    it('should be instantiated correctly', () => {

      const error = new HttpHandlerError('label', (undefined as unknown as number), (undefined as unknown as HttpHandlerResponse));

      expect(error).toBeDefined();
      expect(error).toBeTruthy();

    });

  });

});
