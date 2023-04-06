import { Logger } from '../models/logger';
import { ConsoleLogger } from '../loggers/console-logger';
import { LoggerOptions } from '../models/logger-options';
import { LoggerFactory } from './logger-factory';

/**
 * Creates {@link ConsoleLogger } instances for the given logging level.
 */
export class ConsoleLoggerFactory extends LoggerFactory {

  constructor(loggerOptions: LoggerOptions) {

    super(loggerOptions);

  }

  createLogger(
    defaultLabel: string,
    loggerOptions?: LoggerOptions,
  ): Logger {

    return new ConsoleLogger(
      defaultLabel,
      loggerOptions?.minimumLevel ?? this.loggerOptions.minimumLevel,
      loggerOptions?.minimumLevelPrintData ?? this.loggerOptions.minimumLevelPrintData
    );

  }

}
