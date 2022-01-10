import { WinstonLogger } from './winston-logger';
import { Logger } from './logger';
import { LoggerFactory } from './logger-factory';
import { LoggerLevel } from './logger-level';

/**
 * Creates {@link WinstonLogger } instances for the given logging level.
 */
export class WinstonLoggerFactory implements LoggerFactory {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  createLogger(label: string, minimumLevel: LoggerLevel, minimumLevelPrintData: LoggerLevel): Logger {

    return new WinstonLogger(label, minimumLevel, minimumLevelPrintData);

  }

}
