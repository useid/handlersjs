import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';

describe('Logger', () => {

  class MockLogger extends Logger {

    log(level: LoggerLevel, typeName: string, message: string, data?: unknown): void {

      throw new Error('Method not implemented.');

    }

    constructor(minimumLevel: LoggerLevel, minimumLevelPrintData: LoggerLevel) {

      super(minimumLevel, minimumLevelPrintData);

    }

  }

  const logger = new MockLogger(LoggerLevel.info, LoggerLevel.info);

  const paramCheck = (logFunction: (typeName: string, msg: string) => void) => {

    expect(() => logFunction(undefined, 'msg')).toThrow('Typename should be set');
    expect(() => logFunction(null, 'msg')).toThrow('Typename should be set');
    expect(() => logFunction('string', undefined)).toThrow('Message should be set');
    expect(() => logFunction('string', null)).toThrow('Message should be set');

  };

  describe('info', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.info);

    });

    it('should call log with loggerLevel info and given parameters', () => {

      logger.log = jest.fn();
      logger.info('typeName', 'message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.info, 'typeName', 'message', 'logData');

    });

  });

  describe('debug', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.debug);

    });

    it('should call log with loggerLevel debug and given parameters', () => {

      logger.log = jest.fn();
      logger.debug('typeName', 'message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.debug, 'typeName', 'message', 'logData');

    });

  });

  describe('warn', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.warn);

    });

    it('should call log with loggerLevel warn and given parameters', () => {

      logger.log = jest.fn();
      logger.warn('typeName', 'message', 'logData');
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.warn, 'typeName', 'message', 'logData');

    });

  });

  describe('error', () => {

    it('should error when typename or msg are not provided', () => {

      paramCheck(logger.error);

    });

    it('should call log with loggerLevel warn and given parameters', () => {

      logger.log = jest.fn();
      logger.error('typeName', 'message', new HandlerArgumentError('HandlerArgumentError', 1), true);
      expect(logger.log).toHaveBeenCalledWith(LoggerLevel.error, 'typeName', 'message', { 'caught': true, 'error' : new HandlerArgumentError('HandlerArgumentError', 1) });

    });

  });

});
