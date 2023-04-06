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

  let logger: Logger;

  const paramCheck = (logFunction: (msg: string) => void) => {

    expect(() => logFunction(undefined as unknown as string)).toThrow('Message should be set');
    expect(() => logFunction(null as unknown as string)).toThrow('Message should be set');

  };

  beforeEach(() => {

    logger = new MockLogger(LoggerLevel.info, LoggerLevel.info);

  });

  describe('setLabel', () => {

    it('should set the label', () => {
        
        expect(logger.label).toEqual('test-logger');
        logger.setLabel('new-label');
        expect(logger.label).toEqual('new-label');
        logger.setLabel({ constructor: { name: 'new-label-constructor' } });
        expect(logger.label).toEqual('new-label-constructor');
  
    });

  });

  describe('setVariable', () => {

    it('should set a variable', () => {
        
        expect(logger.variables).toEqual({});
        logger.setVariable('key', 'value');
        expect(logger.variables.key).toEqual('value');
  
    });

  });

  describe('removeVariable', () => {

    it('should remove a variable', () => {
        
        expect(logger.variables).toEqual({});
        logger.setVariable('key', 'value');
        expect(logger.variables.key).toEqual('value');
        logger.removeVariable('key');
        expect(logger.variables.key).toBeUndefined();
  
    });

  });

  describe('clearVariables', () => {
  
    it('should remove all variables', () => {
        
      expect(logger.variables).toEqual({});
      logger.setVariable('key', 'value');
      logger.setVariable('key2', 'value');
      expect(logger.variables.key).toEqual('value');
      logger.clearVariables();
      expect(logger.variables.key).toBeUndefined();
      expect(Object.keys(logger.variables).length).toEqual(0);
  
    });
  
  });

  describe('getVariables', () => {
    
    it('should return all variables', () => {
        
      expect(logger.variables).toEqual({});
      logger.setVariable('key', 'value');
      logger.setVariable('key2', 'value');
      expect(logger.getVariables()).toEqual({ key: 'value', key2: 'value' });
  
    });
    
  });

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
