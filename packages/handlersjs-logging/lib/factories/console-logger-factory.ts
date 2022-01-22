import { Logger } from '../models/logger';
import { LoggerFactory } from '../models/logger-factory';
import { LoggerLevel } from '../models/logger-level';
import { ConsoleLogger } from '../loggers/console-logger';

/**
 * Creates {@link ConsoleLogger } instances for the given logging level.
 */
export class ConsoleLoggerFactory implements LoggerFactory {

  createLogger(label: string, minimumLevel: LoggerLevel, minimumLevelPrintData: LoggerLevel): Logger {

    return new ConsoleLogger(label, minimumLevel, minimumLevelPrintData);

  }

}
