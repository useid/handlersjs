import { LoggerOptions } from './models/logger-options';
import { Logger } from './models/logger';
import { LoggerFactory } from './models/logger-factory';
import { LoggerLevel } from './models/logger-level';

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
  loggable: string | { constructor: { name: string } },
  minimumLevel: LoggerLevel,
  minimumLevelPrintData: LoggerLevel,
  loggerOptions?: LoggerOptions
): Logger => {

  if (!loggerFactory) {

    throw new Error('No LoggerFactory was set to create loggers.');

  }

  return loggerFactory.createLogger(typeof loggable === 'string' ? loggable : loggable.constructor.name, minimumLevel, minimumLevelPrintData, loggerOptions);

};

export const setLoggerFactory = (newLoggerFactory: LoggerFactory): void => {

  loggerFactory = newLoggerFactory;

};

