/* eslint-disable no-console -- this is a logger service */

import { HandlerArgumentError } from '@useid/handlersjs-core';
import { LoggerLevel } from '../models/logger-level';
import { Logger } from './logger';

/**
 * JavaScript console-based logger service
 */
export class ConsoleLogger extends Logger {

  log(level: LoggerLevel, message: string, data?: unknown): void {

    // eslint-disable-next-line no-null/no-null
    if (level === null || level === undefined) {

      throw new HandlerArgumentError('level should be set', level);

    }

    if (!message) {

      throw new HandlerArgumentError('message should be set', message);

    }

    const timestamp: string = new Date().toISOString();

    if (level >= this.minimumLevel) {

      const logMessage = `[${timestamp} ${this.label}] ${message}`;
      const logData = level >= this.minimumLevelPrintData ? data || '' : '';
      const log = [ logMessage, this.variables, logData ];

      switch (level) {

        case LoggerLevel.info:
          console.info(... log);
          break;
        case LoggerLevel.debug:
          console.debug(... log);
          break;
        case LoggerLevel.warn:
          console.warn(... log);
          break;
        case LoggerLevel.error:
        case LoggerLevel.fatal:
          console.error(... log);
          break;
        case LoggerLevel.trace:
        default:
          console.log(... log);
          break;

      }

    }

  }

}
