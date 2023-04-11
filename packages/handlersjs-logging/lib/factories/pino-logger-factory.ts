import { Logger } from '../models/logger';
import { PinoLogger } from '../loggers/pino-logger';
import { PinoLoggerOptions } from '../models/logger-options';
import { LoggerFactory } from './logger-factory';

/**
 * Creates {@link PinoLogger } instances for the given logging level.
 */
export class PinoLoggerFactory extends LoggerFactory {

  constructor (private pinoLoggerOptions: PinoLoggerOptions) {

    super(pinoLoggerOptions);

  }

  createLogger(
    defaultLabel: string,
    pinoLoggerOptions?: PinoLoggerOptions
  ): Logger {

    return new PinoLogger(
      defaultLabel,
      pinoLoggerOptions?.minimumLevel ?? this.pinoLoggerOptions.minimumLevel,
      pinoLoggerOptions?.minimumLevelPrintData ?? this.pinoLoggerOptions.minimumLevelPrintData,
      pinoLoggerOptions?.prettyPrint ?? this.pinoLoggerOptions.prettyPrint
    );

  }

}
