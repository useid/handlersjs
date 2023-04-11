import type { Logger } from '../models/logger';
import { LoggerOptions } from '../models/logger-options';

/**
 * Instantiates new logger instances.
 */
export abstract class LoggerFactory {

  constructor(protected loggerOptions: LoggerOptions) {}

  /**
   * Create a logger instance for the given label.
   *
   * @param label - A label that is used to identify the given logger.
   */
  abstract createLogger(
    label: string,
    loggerOptions?: LoggerOptions
  ): Logger;

}
