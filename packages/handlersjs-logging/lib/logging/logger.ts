import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import { LoggerLevel } from './logger-level';
export abstract class Logger {

  constructor(
    protected readonly label: string,
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
  ) {}

  /**
   * Logs an error message
   *
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  error(message: string, data?: unknown): void {

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.error, message, data);

  }

  /**
   * Logs a warning message
   *
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  warn(message: string, data?: unknown): void {

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.warn, message, data);

  }

  /**
   * Logs an info message
   *
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  info(message: string, data?: unknown): void {

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.info, message, data);

  }

  /**
   * Logs a verbose message
   *
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  verbose(message: string, data?: unknown): void {

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.verbose, message, data);

  }

  /**
   * Logs a debug message
   *
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  debug(message: string, data?: unknown): void {

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.debug, message, data);

  }

  /**
   * Logs a silly message
   *
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  silly(message: string, data?: unknown): void {

    if (!message) {

      throw new HandlerArgumentError('Message should be set', message);

    }

    this.log(LoggerLevel.silly, message, data);

  }

  /**
   * Logs a message
   *
   * @param level Severity level of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  abstract log(level: LoggerLevel, message: string, data?: unknown): void;

}
