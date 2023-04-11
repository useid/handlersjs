/* eslint-disable @typescript-eslint/dot-notation */
import { ConsoleLogger } from './loggers/console-logger';
import { ConsoleLoggerFactory } from './factories/console-logger-factory';
import { getLogger, getLoggerFor, setLogger, setLoggerFactory } from './main';
import { PinoLoggerFactory } from './factories/pino-logger-factory';
import { PinoLogger } from './loggers/pino-logger';

describe('main', () => {

  const logger = new ConsoleLogger('test-logger', 5, 5);
  const loggerFactory = new ConsoleLoggerFactory({ minimumLevel: 5, minimumLevelPrintData: 5 });

  beforeEach(() => {

    setLogger(logger);
    setLoggerFactory(loggerFactory);

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
      const newLogger = new ConsoleLogger('test-logger', 1, 1);
      setLogger(newLogger);
      const newGet = getLogger();
      expect(get).toEqual(logger);
      expect(get).not.toEqual(newLogger);
      expect(newGet).not.toEqual(logger);
      expect(newGet).toEqual(newLogger);

    });

  });

  describe('getLoggerFor', () => {

    it('should create a logger with a label when given a string', () => {

      const testLogger = getLoggerFor('test-logger', { minimumLevel: 5, minimumLevelPrintData: 5 });
      expect(testLogger['label']).toEqual('test-logger');
      expect(testLogger['minimumLevel']).toEqual(5);
      expect(testLogger['minimumLevelPrintData']).toEqual(5);

    });

    it('should create a logger with a label based on constructor name when given an instance of a class', () => {

      const testClass = { constructor: { name: 'test-constructor-name' } };
      const testLogger = getLoggerFor(testClass, { minimumLevel: 4, minimumLevelPrintData: 4 });

      expect(testLogger['label']).toEqual('test-constructor-name');
      expect(testLogger['minimumLevel']).toEqual(4);
      expect(testLogger['minimumLevelPrintData']).toEqual(4);

    });

    it('should error when no loggerFactory is set', () => {

      setLoggerFactory(undefined as unknown as ConsoleLoggerFactory);
      expect(() => getLoggerFor('test-logger')).toThrow('No LoggerFactory was set to create loggers.');

    });

  });

  describe('setLoggerFactory', () => {

    it('should set the logger factory', () => {

      const testLogger = getLoggerFor('test-logger');
      expect(testLogger instanceof ConsoleLogger).toEqual(true);

      setLoggerFactory(new PinoLoggerFactory({ minimumLevel: 5, minimumLevelPrintData: 5 }));

      const newLogger = getLoggerFor('test-logger');
      expect(newLogger instanceof PinoLogger).toEqual(true);

    });

  });

});

