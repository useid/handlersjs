import { WinstonLogger } from '../loggers/winston-logger';
import { Logger } from '../models/logger';
import { LoggerFactory } from '../models/logger-factory';
import { LoggerLevel } from '../models/logger-level';

/**
 * Creates {@link WinstonLogger } instances for the given logging level.
 */
export class WinstonLoggerFactory implements LoggerFactory {

  createLogger(label: string, minimumLevel: LoggerLevel, minimumLevelPrintData: LoggerLevel): Logger {

    return new WinstonLogger(label, minimumLevel, minimumLevelPrintData);

  }

}
