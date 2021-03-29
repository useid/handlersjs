/* eslint-disable no-console -- this is a logger service */

import { HandlerArgumentError } from '../errors/handler-argument-error';
import { LoggerLevel } from './logger-level';

export class ConsoleLogger {
  constructor(private readonly minimumLevel: LoggerLevel, private readonly minimumLevelPrintData: LoggerLevel) {}

  info(typeName: string, message: string, data?: any) {
    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    this.log(LoggerLevel.INFO, typeName, message, data);
  }

  debug(typeName: string, message: string, data?: any) {
    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    this.log(LoggerLevel.DEBUG, typeName, message, data);
  }

  error(typeName: string, message: string, error?: Error | any, caught?: any) {
    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    this.log(LoggerLevel.ERROR, typeName, message, { error, caught });
  }

  log(level: LoggerLevel, typeName: string, message: string, data?: any) {
    if (!level) {
      throw new HandlerArgumentError('Level should be set', typeName);
    }

    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    const displayDate: string = new Date().toLocaleTimeString();

    if (level >= this.minimumLevel) {
      if (level >= LoggerLevel.WARN) {
        if (data && level >= this.minimumLevelPrintData) {
          console.error('[' + displayDate + ' ' + typeName + '] ' + message, '\n', data);
        } else {
          console.error('[' + displayDate + ' ' + typeName + '] ' + message);
        }
      } else {
        if (data && level >= this.minimumLevelPrintData) {
          console.log('[' + displayDate + ' ' + typeName + '] ' + message, '\n', data);
        } else {
          console.log('[' + displayDate + ' ' + typeName + '] ' + message);
        }
      }
    }
  }
}
