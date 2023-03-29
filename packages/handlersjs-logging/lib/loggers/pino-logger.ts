/* eslint-disable no-console -- this is a logger service */

import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import Pino from 'pino';
import { Logger } from '../models/logger';
import { LoggerLevel } from '../models/logger-level';

/** ß
 * JavaScript console-based logger service
 */
export class PinoLogger extends Logger {

  constructor(
    protected readonly label: string,
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
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

    const timestamp: string = new Date().toISOString();

    if (level <= this.minimumLevel) {

      const logData = level > this.minimumLevelPrintData ? '' : data||'';
      // Pino does not use "silly", but "trace" instead. So we need to convert the level.
      const logger = Pino({ level: level === 5 ? 'trace' : LoggerLevel[level].toString() });

      switch (level) {

        case LoggerLevel.info:
          logger.info(logData, message);
          break;

        case LoggerLevel.debug:
          logger.debug(logData, message);
          break;

        case LoggerLevel.warn:
          logger.warn(logData, message);
          break;

        case LoggerLevel.error:
          logger.error(logData, message);
          break;

        default:
          logger.trace(logData, message);
          break;

      }

    }

  }

}
