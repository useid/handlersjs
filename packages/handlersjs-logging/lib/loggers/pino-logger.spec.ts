import Pino from 'pino';
import pretty from 'pino-pretty';
import { LoggerLevel } from '../models/logger-level';
import { PinoLogger } from './pino-logger';

jest.mock('pino', () => jest.fn().mockReturnValue({
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  trace: jest.fn(),
}));

jest.mock('pino-pretty', () => jest.fn().mockImplementation(() => undefined));

describe('PinoLogger', () => {

  let logger: PinoLogger;
  const levels = Object.keys(LoggerLevel).filter((key) => isNaN(Number(key)));

  beforeEach(async () => {

    logger = new PinoLogger('test-logger', LoggerLevel.trace, LoggerLevel.trace);

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(logger).toBeTruthy();

  });

  it('should create a logger that prettifies logs when prettyPrint is true', () =>{

    new PinoLogger('test-logger', 10, 10, true);

    expect(pretty).toHaveBeenCalledTimes(1);

  });

  describe('log', () => {

    const testMessage = 'TestMessage';
    const data = { data: 'data' };

    it.each(levels)('should call logger.%s when passed as LoggerLevel', (level) => {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      logger.log(LoggerLevel[level], testMessage, data);

      expect(Pino()[level]).toHaveBeenCalledTimes(1);
      expect(Pino()[level]).toHaveBeenCalledWith({ variables: {}, data }, expect.stringContaining(testMessage));

    });

    it('should throw when level is undefined', () => {

      expect(() => logger.log(undefined as unknown as LoggerLevel, testMessage)).toThrow('level should be set');

    });

    it('should throw when message is undefined', () => {

      expect(() => logger.log(LoggerLevel.info, undefined as unknown as string)).toThrow('message should be set');

    });

  });

});
