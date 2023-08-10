import { LoggerLevel } from '../models/logger-level';
import { ConsoleLogger } from './console-logger';

jest.mock('console');

describe('ConsoleLogger', () => {

  let logger: ConsoleLogger;
  let spy: Map<string, jest.SpyInstance>;

  beforeEach(async () => {

    logger = new ConsoleLogger('test-logger', LoggerLevel.trace, LoggerLevel.trace);
    spy = new Map();
    spy.set('warn', jest.spyOn(console, 'warn').mockImplementation(() => undefined));
    spy.set('info', jest.spyOn(console, 'info').mockImplementation(() => undefined));
    spy.set('debug', jest.spyOn(console, 'debug').mockImplementation(() => undefined));
    spy.set('error', jest.spyOn(console, 'error').mockImplementation(() => undefined));
    spy.set('log', jest.spyOn(console, 'log').mockImplementation(() => undefined));
    jest.clearAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(logger).toBeTruthy();

  });

  const testMessage = 'TestMessage';
  const data = { data: 'data' };

  describe('log', () => {

    it.each([
      [ 'trace', 'log' ],
      [ 'debug', 'debug' ],
      [ 'info', 'info' ],
      [ 'warn', 'warn' ],
      [ 'error', 'error' ],
      [ 'fatal', 'error' ],
    ])('LoggerLevel.%s should call console.%s', (level, log) => {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      logger.log(LoggerLevel[level], testMessage, data);

      expect(spy.get(log)).toHaveBeenCalledTimes(1);
      expect(spy.get(log)).toHaveBeenCalledWith(expect.stringContaining(testMessage), {}, data);

    });

    it('should throw when level is undefined', () => {

      expect(() => logger.log(undefined as unknown as LoggerLevel, testMessage)).toThrow('level should be set');

    });

    it('should throw when message is undefined', () => {

      expect(() => logger.log(LoggerLevel.info, undefined as unknown as string)).toThrow('message should be set');

    });

    it('should not log data when minimumLevelPrintData < minimumLevel', () => {

      logger = new ConsoleLogger('test-logger', LoggerLevel.trace, LoggerLevel.info);
      logger.log(LoggerLevel.debug, testMessage, data);

      expect(spy.get('debug')).toHaveBeenCalledTimes(1);
      expect(spy.get('debug')).toHaveBeenCalledWith(expect.stringContaining(testMessage), {}, '');

    });

    it('should not log data when data is undefined', () => {

      logger.trace(testMessage, undefined);

      expect(spy.get('log')).toHaveBeenCalledTimes(1);
      expect(spy.get('log')).toHaveBeenCalledWith(expect.stringContaining(testMessage), {}, '');

    });

  });

});
