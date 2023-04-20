import { ConsoleLogger, LoggerLevel } from '@digita-ai/handlersjs-logging';

jest.mock('@digita-ai/handlersjs-logging', () => ({
  ... jest.requireActual('@digita-ai/handlersjs-logging') as any,
  setLogger: jest.fn(),
  getLogger: () => {

    const logger = new ConsoleLogger('TEST', LoggerLevel.trace, LoggerLevel.trace);
    logger.log = jest.fn();

    return logger;

  },
}));
