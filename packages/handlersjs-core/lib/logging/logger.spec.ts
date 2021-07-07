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

  describe('info', () => {

    it('should error when typename or msg are not provided', () => {

      expect(() => logger.info(undefined, 'msg')).toThrow('Typename should be set');
      expect(() => logger.info(null, 'msg')).toThrow('Typename should be set');
      expect(() => logger.info('string', undefined)).toThrow('Message should be set');
      expect(() => logger.info('string', null)).toThrow('Message should be set');

    });

  });

  describe('debug', () => {

    it('should error when typename or msg are not provided', () => {

      expect(() => logger.debug(undefined, 'msg')).toThrow('Typename should be set');
      expect(() => logger.debug(null, 'msg')).toThrow('Typename should be set');
      expect(() => logger.debug('string', undefined)).toThrow('Message should be set');
      expect(() => logger.debug('string', null)).toThrow('Message should be set');

    });

  });

  describe('warn', () => {

    it('should error when typename or msg are not provided', () => {

      expect(() => logger.warn(undefined, 'msg')).toThrow('Typename should be set');
      expect(() => logger.warn(null, 'msg')).toThrow('Typename should be set');
      expect(() => logger.warn('string', undefined)).toThrow('Message should be set');
      expect(() => logger.warn('string', null)).toThrow('Message should be set');

    });

  });

  describe('error', () => {

    it('should error when typename or msg are not provided', () => {

      expect(() => logger.error(undefined, 'msg')).toThrow('Typename should be set');
      expect(() => logger.error(null, 'msg')).toThrow('Typename should be set');
      expect(() => logger.error('string', undefined)).toThrow('Message should be set');
      expect(() => logger.error('string', null)).toThrow('Message should be set');

    });

  });

});
