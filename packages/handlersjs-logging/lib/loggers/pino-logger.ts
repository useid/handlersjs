/* eslint-disable no-console -- this is a logger service */

import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import Pino from 'pino';
import pretty, { colorizerFactory } from 'pino-pretty';
import { Logger } from '../models/logger';
import { LoggerLevel } from '../models/logger-level';

/**
 * A logger that uses the "pino" library to log messages.
 * Pino: https://github.com/pinojs/pino
 */
export class PinoLogger extends Logger {

  constructor(
    protected readonly label: string,
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
    protected readonly prettyPrint: boolean = false,
  ) {

    super(label, minimumLevel, minimumLevelPrintData);

  }

  log(level: LoggerLevel, message: string, data?: unknown): void {

    if (level === null || level === undefined) {

      throw new HandlerArgumentError('level should be set', this.label);

    }

    if (!message) {

      throw new HandlerArgumentError('message should be set', message);

    }

    if (level <= this.minimumLevel) {

      const logData = level > this.minimumLevelPrintData
        ? {}
        // if data is a string, convert it to an object with a data property. Pino expects data to be an object. If it remains a string, it will use the data as a message, and drop the rest of our log.
        : typeof data === 'string'
          ? { data }
          // if data is undefined, convert it to an empty object.
          : data ?? {};

      const logMessage = `[${this.label}] ${message}`;

      const loggerOptions = {
        // Define custom levels for the pino logger to match our own logger levels.
        customLevels: {
          error: 0,
          warn: 1,
          info: 2,
          verbose: 3,
          debug: 4,
          silly: 5,
        },
        useOnlyCustomLevels: true,
        level: LoggerLevel[level].toString(),
      };

      // if prettyPrint is true, use pino-pretty with custom options to prettify the log. Otherwise, use pino without prettifying.
      const logger = this.prettyPrint ? Pino(loggerOptions, pretty({
        customPrettifiers: {
          level: (logLevel) => {

            // define what colors each level should have when prettified
            const levelColorize = colorizerFactory(true, [ [ 0, 'red' ], [ 1, 'yellow' ], [ 2, 'green' ], [ 3, 'white' ], [ 4, 'blue' ], [ 5, 'gray' ] ]);

            // tell pino-pretty to colorize the logLevel, and tell it what name the log level should have in the prettified log.
            return levelColorize(logLevel.toString(), { customLevels: { 0: 'ERROR', 1: 'WARN', 2: 'INFO', 3: 'VERBOSE', 4: 'DEBUG', 5: 'SILLY' } });

          },
        },
      })) : Pino(loggerOptions);

      switch (level) {

        case LoggerLevel.error:
          logger.error(logData, logMessage);
          break;

        case LoggerLevel.warn:
          logger.warn(logData, logMessage);
          break;

        case LoggerLevel.info:
          logger.info(logData, logMessage);
          break;

        case LoggerLevel.verbose:
          logger.verbose(logData, logMessage);
          break;

        case LoggerLevel.debug:
          logger.debug(logData, logMessage);
          break;

        default:
          logger.silly(logData, logMessage);
          break;

      }

    }

  }

}
