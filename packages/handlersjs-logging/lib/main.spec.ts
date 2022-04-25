/* eslint-disable @typescript-eslint/dot-notation */
import { ConsoleLogger } from './loggers/console-logger';
import { ConsoleLoggerFactory } from './factories/console-logger-factory';
import { WinstonLogger } from './loggers/winston-logger';
import { WinstonLoggerFactory } from './factories/winston-logger-factory';
import { getLogger, getLoggerFor, setLogger, setLoggerFactory } from './main';

describe('main', () => {

  const logger = new ConsoleLogger('test-logger', 5, 5);
  const loggerFactory = new ConsoleLoggerFactory();

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

      const testLogger = getLoggerFor('test-logger', 5, 5);
      expect(testLogger['label']).toEqual('test-logger');
      expect(testLogger['minimumLevel']).toEqual(5);
      expect(testLogger['minimumLevelPrintData']).toEqual(5);

    });

    it('should create a logger with a label based on constructor name when given an instance of a class', () => {

      const testClass = { constructor: { name: 'test-constructor-name' } };
      const testLogger = getLoggerFor(testClass, 4, 4);

      expect(testLogger['label']).toEqual('test-constructor-name');
      expect(testLogger['minimumLevel']).toEqual(4);
      expect(testLogger['minimumLevelPrintData']).toEqual(4);

    });

    it('should error when no loggerFactory is set', () => {

      setLoggerFactory(undefined);
      expect(() => getLoggerFor('test-logger', 5, 5)).toThrow('No LoggerFactory was set to create loggers.');

    });

  });

  describe('setLoggerFactory', () => {

    it('should set the logger factory', () => {

      const testLogger = getLoggerFor('test-logger', 5, 5);
      expect(testLogger instanceof ConsoleLogger).toEqual(true);

      setLoggerFactory(new WinstonLoggerFactory());

      const newLogger = getLoggerFor('test-logger', 4, 4);
      expect(newLogger instanceof WinstonLogger).toEqual(true);

    });

  });

});

