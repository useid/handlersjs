import { LoggerLevel } from '../models/logger-level';
import { ConsoleLogger } from './console-logger';

jest.mock('console');

describe('ConsoleLogger', () => {

  let logger: ConsoleLogger;
  const spy = new Map();
  const levels = [ 'info', 'debug', 'warn', 'error' ].map((s) => [ s, s ]);

  beforeEach(async () => {

    logger = new ConsoleLogger('test-logger', 6, 6);
    spy.set('warn', jest.spyOn(console, 'warn').mockImplementation(() => undefined));
    spy.set('info', jest.spyOn(console, 'info').mockImplementation(() => undefined));
    spy.set('debug', jest.spyOn(console, 'debug').mockImplementation(() => undefined));
    spy.set('error', jest.spyOn(console, 'error').mockImplementation(() => undefined));
    spy.set('log', jest.spyOn(console, 'log').mockImplementation(() => undefined));

  });

  afterEach(() => {

    // clear spies
    jest.clearAllMocks();

    for (const value of Object.values(spy)) { value.mockReset(); }

  });

  it('should be correctly instantiated', () => {

    expect(logger).toBeTruthy();

  });

  const testMessage = 'TestMessage';
  const data = { data: 'data' };

  describe('log', () => {

    it.each([ ...levels, [ 'silly', 'log' ] ])('LoggerLevel.%s should call console.%s', (level, log) => {

      logger.log(LoggerLevel[level], testMessage, data);
      expect(spy.get(log)).toHaveBeenCalledTimes(1);
      expect(spy.get(log)).toHaveBeenCalledWith(expect.stringContaining(testMessage), {}, data);

    });

    const params = {
      level: LoggerLevel.info,
      message: 'test message',
    };

    it.each(Object.keys(params))('throws when %s is null or undefined', (keyToBeNull) => {

      const testArgs = { ...params };
      testArgs[keyToBeNull] = undefined;
      expect(() => logger.log(testArgs.level, testArgs.message)).toThrow(`${keyToBeNull} should be set`);

    });

  });

  describe('level logs', () => {

    it.each(levels)('should log a %s message', async(level) => {

      const logSpy = jest.spyOn(logger, 'log');

      if (level === 'error') {

        logger[level]('TestService', { error: 'test error', caught: 'error' });
        expect(logSpy).toHaveBeenCalledWith(LoggerLevel.error, 'TestService', { error: 'test error', caught: 'error' });

      } else {

        logger[level]('TestService', 'test data');
        expect(logSpy).toHaveBeenCalledWith(LoggerLevel[level], 'TestService', 'test data');

      }

    });

  });

});
