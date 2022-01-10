import { Logger } from './logging/logger';
import { LoggerFactory } from './logging/logger-factory';
import { LoggerLevel } from 'logging/logger-level';

let logger: Logger;
let loggerFactory: LoggerFactory;

/**
 * returns the global logger.
 *
 * @returns { Logger }
 */
export const getLogger = (): Logger => logger;

/**
 * Sets the global logger.
 * This will cause the logger returned by {@link getLogger} to be changed.
 *
 * @param { Logger } logger - The (new) logger to set globally.
 */
export const setLogger = (newLogger: Logger): void => {

  logger = newLogger;

};

/**
 * Gets a logger instance for the given class instance.
 *
 * @param loggable - A class instance or a class string name.
 */
export const getLoggerFor = (
  loggable: string | Instance,
  minimumLevel: LoggerLevel,
  minimumLevelPrintData: LoggerLevel
): Logger => {

  if (!loggerFactory) {

    throw new Error('No LoggerFactory was set to create loggers.');

  }

  return loggerFactory.createLogger(typeof loggable === 'string' ? loggable : loggable.constructor.name, minimumLevel, minimumLevelPrintData);

};

export const setLoggerFactory = (newLoggerFactory: LoggerFactory): void => {

  loggerFactory = newLoggerFactory;

};

/**
 * Helper interface to identify class instances.
 */
interface Instance {
  constructor: { name: string };
}
