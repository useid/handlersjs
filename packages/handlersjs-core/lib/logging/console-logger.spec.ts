import * as path from 'path';
import { ComponentsManager } from 'componentsjs';
import { ConsoleLogger } from './console-logger';
import { LoggerLevel } from './logger-level';

describe('ConsoleLogger', () => {
  let service: ConsoleLogger;
  let manager: ComponentsManager<any>;

  beforeAll(async () => {
    const mainModulePath = path.join(__dirname, '../../');
    const configPath = path.join(mainModulePath, 'config/config-test.json');
    manager = await ComponentsManager.build({ mainModulePath });
    await manager.configRegistry.register(configPath);
  });

  beforeEach(async () => {
    service = await manager.instantiate('urn:handlersjs-core:test:ConsoleLogger');
  });

  afterEach(() => {
    // clear spies
    jest.clearAllMocks();
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  describe('log', () => {

    const levels = [ 'info', 'debug', 'warn', 'error' ];

    it('LoggerLevel.silly should call console.log', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      service.log(LoggerLevel.silly, 'TestService', 'test message', 'data');
      expect(consoleSpy).toHaveBeenCalled();
    });

    for (const level of levels) {
      if (level) {
        it(`LoggerLevel.${level} should call console.${level}`, () => {
          const consoleSpy = jest.spyOn(console, level as any);
          service.log(LoggerLevel[level], 'TestService', 'test message', 'data');
          expect(consoleSpy).toHaveBeenCalled();
        });
      }
    }

    it('should throw error when level is null or undefined', () => {
      expect(() => service.log(null, 'TestService', 'test message', 'data'))
        .toThrowError('Level should be set');
    });

    it('should throw error when typeName is null or undefined', () => {
      expect(() => service.log(LoggerLevel.info, null, 'test message', 'data'))
        .toThrowError('Typename should be set');
    });

    it('should throw error when message is null or undefined', () => {
      expect(() => service.log(LoggerLevel.info, 'TestService', null, 'data'))
        .toThrowError('Message should be set');
    });
  });

  describe('level logs', () => {

    const levels = [ 'info', 'debug', 'warn', 'error' ];

    for (const level of levels) {
      if (level) {
        it(`should log a ${level} message`, () => {
          const loggerSpy = jest.spyOn(service, 'log');
          if (level === 'error') {
            service[level]('TestService', 'test message', 'test error', 'error');
            expect(loggerSpy).toHaveBeenCalledWith(LoggerLevel.error, 'TestService', 'test message', { error: 'test error', caught: 'error' });
          } else {
            service[level]('TestService', 'test message', 'test data');
            expect(loggerSpy).toHaveBeenCalledWith(LoggerLevel[level], 'TestService', 'test message', 'test data');
          }
        });

        it('should throw error when typeName is null or undefined', () => {
          expect(() => service[level](null, 'test message', 'test data'))
            .toThrowError('Typename should be set');
        });

        it('should throw error when message is null or undefined', () => {
          expect(() => service[level]('TestService', null, 'test data'))
            .toThrowError('Message should be set');
        });
      }
    }
  });

});
