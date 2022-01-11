import { createLogger, Logger } from 'winston';
import { mock } from 'jest-mock-extended';
import { WinstonLogger } from './winston-logger';
import { LoggerLevel } from './logger-level';

let testLogger: Logger;

jest.mock('winston', () => ({
  createLogger: jest.fn().mockImplementation(() => {

    testLogger = mock<Logger>();

    return testLogger;

  }),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    File: jest.fn(),
    Console: jest.fn(),
  },
}));

describe('WinstonLogger', () => {

  let logger: WinstonLogger;
  const spy = new Map();
  const levels = [ 'info', 'debug', 'warn', 'error' ].map((s) => [ s, s ]);

  beforeEach(async () => {

    logger = new WinstonLogger('test-logger', 6, 6);

  });

  afterEach(() => {

    // clear spies
    jest.clearAllMocks();

    for (const [ key, value ] of Object.entries(spy)) { value.mockReset(); }

  });

  it('should be correctly instantiated', () => {

    expect(logger).toBeTruthy();

  });

  const testMessage = 'TestMessage';
  const data = { data: 'data' };

  describe('log', () => {

    it.each([ ...levels, [ 'silly', 'log' ] ])('LoggerLevel.%s should call winston logger with appropriate parameters', (level, log) => {

      logger.log(LoggerLevel[level], testMessage, data);
      expect(testLogger.log).toHaveBeenCalledTimes(1);

      expect(testLogger.log).toHaveBeenCalledWith({
        data,
        level,
        message: testMessage,
        printData: true,
        typeName: 'test-logger',
      });

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
