import { Logger } from './logging/logger';

let logger: Logger;

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
