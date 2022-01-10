import { ConsoleLogger } from './console-logger';
import { Logger } from './logger';
import { LoggerFactory } from './logger-factory';
import { LoggerLevel } from './logger-level';

/**
 * Creates {@link ConsoleLogger } instances for the given logging level.
 */
export class ConsoleLoggerFactory implements LoggerFactory {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  createLogger(label: string, minimumLevel: LoggerLevel, minimumLevelPrintData: LoggerLevel): Logger {

    return new ConsoleLogger(label, minimumLevel, minimumLevelPrintData);

  }

}
