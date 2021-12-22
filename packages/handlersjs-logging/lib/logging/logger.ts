/* eslint-disable no-console -- this is a logger service */

import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import { LoggerLevel } from './logger-level';
export abstract class Logger {

  constructor(
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
  ) {}

  /**
   * Logs an error message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  error(typeName: string, message: string, data?: unknown): void {

    if (!typeName) {

      throw new HandlerArgumentError('Typename should be set', typeName);

    }

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.error, typeName, message, data);

  }

  /**
   * Logs a warning message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  warn(typeName: string, message: string, data?: unknown): void {

    if (!typeName) {

      throw new HandlerArgumentError('Typename should be set', typeName);

    }

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.warn, typeName, message, data);

  }

  /**
   * Logs an info message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  info(typeName: string, message: string, data?: unknown): void {

    if (!typeName) {

      throw new HandlerArgumentError('Typename should be set', typeName);

    }

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.info, typeName, message, data);

  }

  /**
   * Logs a verbose message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  verbose(typeName: string, message: string, data?: unknown): void {

    if (!typeName) {

      throw new HandlerArgumentError('Typename should be set', typeName);

    }

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.verbose, typeName, message, data);

  }

  /**
   * Logs a debug message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  debug(typeName: string, message: string, data?: unknown): void {

    if (!typeName) {

      throw new HandlerArgumentError('Typename should be set', typeName);

    }

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.debug, typeName, message, data);

  }

  /**
   * Logs a silly message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  silly(typeName: string, message: string, data?: unknown): void {

    if (!typeName) {

      throw new HandlerArgumentError('Typename should be set', typeName);

    }

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.silly, typeName, message, data);

  }

  /**
   * Logs a message
   *
   * @param level Severity level of the log
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  abstract log(level: LoggerLevel, typeName: string, message: string, data?: unknown): void;

}
