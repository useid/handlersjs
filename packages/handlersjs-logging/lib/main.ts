import { Logger } from './logging/logger';

let logger: Logger;

/**
 * returns the global logger parameter.
 *
 * @returns { Logger }
 */
export const getLogger = (): Logger => logger;

/**
 * Sets the global logger parameter.
 * This will cause the logger returned by {@link getLogger} to be changed.
 *
 * @param { Logger } logger - A logger factory.
 */
export const setLogger = (newLogger: Logger): void => {

  logger = newLogger;

};
