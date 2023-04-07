import Pino from 'pino';
import pretty from 'pino-pretty';
import { LoggerLevel } from '../models/logger-level';
import { PinoLogger } from './pino-logger';

jest.mock('pino', () => jest.fn().mockReturnValue({
  warn: jest.fn().mockImplementation(() => undefined),
  info: jest.fn().mockImplementation(() => undefined),
  debug: jest.fn().mockImplementation(() => undefined),
  error: jest.fn().mockImplementation(() => undefined),
  verbose: jest.fn().mockImplementation(() => undefined),
  silly: jest.fn().mockImplementation(() => undefined),
}));

jest.mock('pino-pretty', () => jest.fn().mockImplementation(() => undefined));

describe('PinoLogger', () => {

  let logger: PinoLogger;
  const levels = [ 'info', 'debug', 'warn', 'error', 'silly', 'verbose' ].map((s) => [ s, s ]);

  beforeEach(async () => {

    logger = new PinoLogger('test-logger', 5, 5);

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(logger).toBeTruthy();

  });

  it('should create a logger that prettifies logs when prettyPrint is true', () =>{

    new PinoLogger('test-logger', 5, 5, true);

    expect(pretty).toHaveBeenCalledTimes(1);

    expect(pretty).toHaveBeenCalledWith(expect.objectContaining({
      customPrettifiers: {
        level: expect.any(Function),
      },
    }));

  });

  describe('log', () => {

    const testMessage = 'TestMessage';
    const data = { data: 'data' };

    it.each(levels)('LoggerLevel.%s should call the logger returned by pino with %s', (level, log) => {

      logger.log(LoggerLevel[level], testMessage, data);
      expect(Pino()[log]).toHaveBeenCalledTimes(1);
      expect(Pino()[log]).toHaveBeenCalledWith({ variables: {}, data }, expect.stringContaining(testMessage));

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
