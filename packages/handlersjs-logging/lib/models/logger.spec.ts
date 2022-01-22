import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';

describe('Logger', () => {

  class MockLogger extends Logger {

    log(level: LoggerLevel, message: string, data?: unknown): void {

      throw new Error('Method not implemented.');

    }

    constructor(minimumLevel: LoggerLevel, minimumLevelPrintData: LoggerLevel) {

      super('test-logger', minimumLevel, minimumLevelPrintData);

    }

  }

  const logger = new MockLogger(LoggerLevel.info, LoggerLevel.info);

  const paramCheck = (logFunction: (msg: string) => void) => {

    expect(() => logFunction(undefined)).toThrow('Message should be set');
    expect(() => logFunction(null)).toThrow('Message should be set');

  };

  describe('info', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.info);

    });

    it('should call log with loggerLevel info and given parameters', () => {

      logger.log = jest.fn();
      logger.info('message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.info, 'message', 'logData');

    });

  });

  describe('debug', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.debug);

    });

    it('should call log with loggerLevel debug and given parameters', () => {

      logger.log = jest.fn();
      logger.debug('message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.debug, 'message', 'logData');

    });

  });

  describe('warn', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.warn);

    });

    it('should call log with loggerLevel warn and given parameters', () => {

      logger.log = jest.fn();
      logger.warn('message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.warn, 'message', 'logData');

    });

  });

  describe('error', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.error);

    });

    it('should call log with loggerLevel warn and given parameters', () => {

      logger.log = jest.fn();
      logger.error('message', { error: new HandlerArgumentError('HandlerArgumentError', 1), caught: true });
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.error, 'message', { 'caught': true, 'error' : new HandlerArgumentError('HandlerArgumentError', 1) });

    });

  });

  describe('silly', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.silly);

    });

    it('should call log with loggerLevel warn and given parameters', () => {

      logger.log = jest.fn();
      logger.silly('message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.silly, 'message', 'logData');

    });

  });

  describe('verbose', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.verbose);

    });

    it('should call log with loggerLevel warn and given parameters', () => {

      logger.log = jest.fn();
      logger.verbose('message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.verbose, 'message', 'logData');

    });

  });

});
