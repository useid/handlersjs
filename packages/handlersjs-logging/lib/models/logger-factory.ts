import type { Logger } from './logger';
import { LoggerLevel } from './logger-level';

/**
 * Instantiates new logger instances.
 */
export interface LoggerFactory {
  /**
   * Create a logger instance for the given label.
   *
   * @param label - A label that is used to identify the given logger.
   */
  createLogger: (label: string, minimumLevel: LoggerLevel, minimumLevelPrintData: LoggerLevel) => Logger;
}
