import { getLogger, setLogger } from './main';
import { Logger } from './loggers/logger';

describe('main', () => {

  describe('getLogger', () => {

    it('should throw an error when no logger is set', () => {

      expect(() => getLogger()).toThrow('No logger was set. Set a logger using setLogger()');

    });

    it('should return the global logger', () => {

      const logger = {} as unknown as Logger;
      setLogger(logger);

      expect(getLogger()).toEqual(logger);

    });

  });

  describe('setLogger', () => {

    it('should set the global logger', () => {

      const logger = {} as unknown as Logger;
      setLogger(logger);

      expect(getLogger()).toEqual(logger);

    });

  });

});
