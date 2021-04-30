/* eslint-disable no-console -- this is a logger service */

import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';

/**
 * JavaScript console-based logger service
 */
export class ConsoleLogger extends Logger {

  constructor(
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
  ) {
    super(minimumLevel, minimumLevelPrintData);
  }

  log(level: LoggerLevel, typeName: string, message: string, data?: any) {
    if (level === null || level === undefined) {
      throw new HandlerArgumentError('level should be set', typeName);
    }

    if (!typeName) {
      throw new HandlerArgumentError('typeName should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('message should be set', message);
    }

    const timestamp: string = new Date().toISOString();

    if (level <= this.minimumLevel) {
      const logMessage = `[${timestamp} ${typeName}] ${message}`;
      const logData = level > this.minimumLevelPrintData ? '' : data||'';
      const log = [ logMessage, logData ];
      switch (level) {

      case LoggerLevel.info:
        console.info(...log);
        break;

      case LoggerLevel.debug:
        console.debug(...log);
        break;

      case LoggerLevel.warn:
        console.warn(...log);
        break;

      case LoggerLevel.error:
        console.error(...log);
        break;

      default:
        console.log(...log);
        break;
      }
    }
  }
}
