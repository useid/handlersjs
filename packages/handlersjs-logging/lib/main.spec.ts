import { ConsoleLogger } from './logging/console-logger';
import { Logger } from './logging/logger';
import { LoggerLevel } from './logging/logger-level';
import { getLogger, setLogger } from './main';

describe('main', () => {

  const logger = new ConsoleLogger(5, 5);

  beforeAll(() => {

    setLogger(logger);

  });

  describe('getLogger', () => {

    it('should return the global logger', () => {

      const get = getLogger();
      expect(get).toEqual(logger);

    });

  });

  describe('setLogger', () => {

    it('should set the global logger', () => {

      const get = getLogger();
      const newLogger = new ConsoleLogger(1, 1);
      setLogger(newLogger);
      const newGet = getLogger();
      expect(get).toEqual(logger);
      expect(get).not.toEqual(newLogger);
      expect(newGet).not.toEqual(logger);
      expect(newGet).toEqual(newLogger);

    });

  });

});

