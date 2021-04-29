import { ConsoleLogger } from './console-logger';
import { LoggerLevel } from './logger-level';

jest.mock('console');

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  const spy = new Map();
  const levels = [ 'info', 'debug', 'warn', 'error' ];
  beforeEach(async () => {
    logger = new ConsoleLogger(6, 6);
    spy.set('warn', jest.spyOn(console, 'warn').mockImplementation(() => undefined));
    spy.set('info', jest.spyOn(console, 'info').mockImplementation(() => undefined));
    spy.set('debug', jest.spyOn(console, 'debug').mockImplementation(() => undefined));
    spy.set('error', jest.spyOn(console, 'error').mockImplementation(() => undefined));
    spy.set('log', jest.spyOn(console, 'log').mockImplementation(() => undefined));
  });

  afterEach(() => {
    // clear spies
    jest.clearAllMocks();
    for (const [ key, value ] of Object.entries(spy)) {
      value.mockReset();
    }
  });

  it('should be correctly instantiated', () => {
    expect(logger).toBeTruthy();
  });

  describe('log', () => {

    it('LoggerLevel.silly should call console.log', () => {
      logger.log(LoggerLevel.silly, 'TestService', 'test message', 'data');
      expect(spy.get('log')).toHaveBeenCalledTimes(1);
    });

    it.each(levels.map((s) => [ s, s ]))('LoggerLevel.%s should call console.%s', (level) => {
      logger.log(LoggerLevel[level], 'TestService', 'test message', 'data');
      expect(spy.get(level)).toHaveBeenCalledTimes(1);
    });

    const params = {
      level: LoggerLevel.info,
      typeName: ' TestService',
      message: 'test message',
    };
    it.each(Object.keys(params))('throws when %s is null or undefined', (keyToBeNull) => {
      const testArgs = { ...params };
      testArgs[keyToBeNull] = undefined;
      expect(() => logger.log(testArgs.level, testArgs.typeName, testArgs.message)).toThrow(`${keyToBeNull} should be set`);
    });
  });

  describe('level logs', () => {
    it.each(levels)('should log a %s message', async(level) => {
      const logSpy = jest.spyOn(logger, 'log');
      if (level === 'error') {
        logger[level]('TestService', 'test message', 'test error', 'error');
        expect(logSpy).toHaveBeenCalledWith(LoggerLevel.error, 'TestService', 'test message', { error: 'test error', caught: 'error' });
      } else {
        logger[level]('TestService', 'test message', 'test data');
        expect(logSpy).toHaveBeenCalledWith(LoggerLevel[level], 'TestService', 'test message', 'test data');
      }
    });
  });

});
