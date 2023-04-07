/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from '@digita-ai/handlersjs-logging';

jest.mock('@digita-ai/handlersjs-logging', () => ({
  ... jest.requireActual('@digita-ai/handlersjs-logging') as any,
  getLogger: () => new ConsoleLogger('TEST', 5, 5),
  getLoggerFor: () => {

    const logger = new ConsoleLogger('TEST', 5, 5);
    logger.log = jest.fn();

    return logger;

  },
}));
