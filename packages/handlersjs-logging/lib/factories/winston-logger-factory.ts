import { WinstonLogger } from '../loggers/winston-logger';
import { Logger } from '../models/logger';
import { LoggerOptions } from '../models/logger-options';
import { LoggerFactory } from './logger-factory';

/**
 * Creates {@link WinstonLogger } instances for the given logging level.
 */
export class WinstonLoggerFactory extends LoggerFactory {

  constructor(loggerOptions: LoggerOptions) {

    super(loggerOptions);

  }

  createLogger(label: string, loggerOptions?: LoggerOptions): Logger {

    return new WinstonLogger(
      label,
      loggerOptions?.minimumLevel ?? this.loggerOptions.minimumLevel,
      loggerOptions?.minimumLevelPrintData ?? this.loggerOptions.minimumLevelPrintData
    );

  }

}
