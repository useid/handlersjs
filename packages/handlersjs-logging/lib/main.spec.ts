/* eslint-disable @typescript-eslint/dot-notation */
import { ConsoleLogger } from './loggers/console-logger';
import { ConsoleLoggerFactory } from './factories/console-logger-factory';
import { getLogger, getLoggerFor, setLogger, setLoggerFactory } from './main';
import { PinoLoggerFactory } from './factories/pino-logger-factory';
import { PinoLogger } from './loggers/pino-logger';
import { LoggerLevel } from './models/logger-level';
import { Logger } from './models/logger';

describe('main', () => {

  const loggerFactory = new ConsoleLoggerFactory(
    { minimumLevel: LoggerLevel.trace, minimumLevelPrintData: LoggerLevel.trace },
  );

  beforeEach(() => {

    setLoggerFactory(loggerFactory);
    setLogger(loggerFactory.createLogger('test-logger'));

  });

  describe('getLogger', () => {

    it('should return the global logger', () => {

      expect(getLogger()).toEqual(expect.any(Logger));

    });

  });

  describe('setLogger', () => {

    it('should set the global logger', () => {

      const oldLogger = getLogger();
      const newLogger = loggerFactory.createLogger('new-logger');
      setLogger(newLogger);
      const newLoggerGet = getLogger();

      expect(oldLogger).toEqual(expect.any(Logger));
      expect(newLoggerGet).not.toEqual(oldLogger);
      expect(newLogger).toEqual(newLoggerGet);

    });

  });

  describe('getLoggerFor', () => {

    it('should create a logger with a label when given a string', () => {

      const testLogger = getLoggerFor('test-logger');
      expect(testLogger['label']).toEqual('test-logger');
      expect(testLogger['minimumLevel']).toEqual(loggerFactory['loggerOptions']['minimumLevel']);
      expect(testLogger['minimumLevelPrintData']).toEqual(loggerFactory['loggerOptions']['minimumLevelPrintData']);

    });

    it('should create a logger with a label based on constructor name when given an instance of a class', () => {

      const testClass = { constructor: { name: 'test-constructor-name' } };
      const testLogger = getLoggerFor(testClass);

      expect(testLogger['label']).toEqual('test-constructor-name');

    });

    it('should error when no loggerFactory is set', () => {

      setLoggerFactory(undefined as unknown as ConsoleLoggerFactory);
      expect(() => getLoggerFor('test-logger')).toThrow('No LoggerFactory was set to create loggers.');

    });

  });

  describe('setLoggerFactory', () => {

    it('should set the logger factory', () => {

      const testLogger = getLoggerFor('test-logger');
      expect(testLogger).toEqual(expect.any(ConsoleLogger));

      setLoggerFactory(new PinoLoggerFactory(
        { minimumLevel: LoggerLevel.trace, minimumLevelPrintData: LoggerLevel.trace },
      ));

      const newLogger = getLoggerFor('test-logger');
      expect(newLogger).toEqual(expect.any(PinoLogger));

    });

  });

});

