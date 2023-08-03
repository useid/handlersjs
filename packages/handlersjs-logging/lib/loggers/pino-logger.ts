/* eslint-disable no-console -- this is a logger service */
import { HandlerArgumentError } from '@useid/handlersjs-core';
import Pino from 'pino';
import pretty from 'pino-pretty';
import { LoggerLevel } from '../models/logger-level';
import { Logger } from './logger';

/**
 * A logger that uses the "pino" library to log messages.
 * Pino: https://github.com/pinojs/pino
 */
export class PinoLogger extends Logger {

  private pinoLoggerInstance: Pino.Logger;

  constructor(
    defaultLabel: string,
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
    protected readonly prettyPrint: boolean = false,
  ) {

    super(defaultLabel, minimumLevel, minimumLevelPrintData);

    const loggerOptions = { level: LoggerLevel[minimumLevel].toString() };

    // if prettyPrint is true, use pino-pretty. Otherwise, use pino without prettifying.
    this.pinoLoggerInstance = this.prettyPrint ? Pino(loggerOptions, pretty()) : Pino(loggerOptions);

  }

  log(level: LoggerLevel, message: string, data?: unknown): void {

    // eslint-disable-next-line no-null/no-null
    if (level === null || level === undefined) {

      throw new HandlerArgumentError('level should be set', level);

    }

    if (!message) {

      throw new HandlerArgumentError('message should be set', message);

    }

    if (level >= this.minimumLevel) {

      const logData = {
        variables: this.variables,
        ... (level >= this.minimumLevelPrintData && !!data) && { data },
      };

      const logMessage = `[${this.label}] ${message}`;

      switch (level) {

        case LoggerLevel.fatal:
          this.pinoLoggerInstance.fatal(logData, logMessage);
          break;
        case LoggerLevel.error:
          this.pinoLoggerInstance.error(logData, logMessage);
          break;
        case LoggerLevel.warn:
          this.pinoLoggerInstance.warn(logData, logMessage);
          break;
        case LoggerLevel.info:
          this.pinoLoggerInstance.info(logData, logMessage);
          break;
        case LoggerLevel.debug:
          this.pinoLoggerInstance.debug(logData, logMessage);
          break;
        case LoggerLevel.trace:
        default:
          this.pinoLoggerInstance.trace(logData, logMessage);
          break;

      }

    }

  }

}
