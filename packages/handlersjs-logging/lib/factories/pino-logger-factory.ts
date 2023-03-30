import { Logger } from '../models/logger';
import { LoggerFactory } from '../models/logger-factory';
import { LoggerLevel } from '../models/logger-level';
import { PinoLogger } from '../loggers/pino-logger';
import { LoggerOptions } from '../models/logger-options';

/**
 * Creates {@link PinoLogger } instances for the given logging level.
 */
export class PinoLoggerFactory implements LoggerFactory {

  createLogger(
    label: string,
    minimumLevel: LoggerLevel,
    minimumLevelPrintData: LoggerLevel,
    loggerOptions?: LoggerOptions
  ): Logger {

    return new PinoLogger(label, minimumLevel, minimumLevelPrintData, loggerOptions?.prettyPrint);

  }

}
