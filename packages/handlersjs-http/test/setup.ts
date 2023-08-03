import { ConsoleLogger, LoggerLevel } from '@useid/handlersjs-logging';

jest.mock('@useid/handlersjs-logging', () => ({
  ...jest.requireActual('@useid/handlersjs-logging') as any,
  setLogger: jest.fn(),
  getLogger: () => {

    const logger = new ConsoleLogger('TEST', LoggerLevel.trace, LoggerLevel.trace);
    logger.log = jest.fn();

    return logger;

  },
}));
