/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from '@digita-ai/handlersjs-logging';

jest.mock('@digita-ai/handlersjs-logging', () => ({
  ... jest.requireActual('@digita-ai/handlersjs-logging') as any,
  getLogger: () => new ConsoleLogger('HTTP', 5, 5),
  getLoggerFor: () => new ConsoleLogger('HTTP', 5, 5),
}));
