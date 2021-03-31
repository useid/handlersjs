/* eslint-disable no-console -- this is a logger service */

import { HandlerArgumentError } from '../errors/handler-argument-error';
import { LoggerLevel } from './logger-level';
export abstract class Logger {

  constructor(
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
  ) {}

  /**
   * Logs an info message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  info(typeName: string, message: string, data?: any) {
    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    this.log(LoggerLevel.info, typeName, message, data);
  }

  /**
   * Logs a debug message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  debug(typeName: string, message: string, data?: any) {
    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    this.log(LoggerLevel.debug, typeName, message, data);
  }

  /**
   * Logs a warning message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  warn(typeName: string, message: string, data?: any) {
    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    this.log(LoggerLevel.warn, typeName, message, data);
  }

  /**
   * Logs an error message
   *
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param error The error that was thrown
   * @param caught The error that was caught
   */
  error(typeName: string, message: string, error?: Error | any, caught?: any) {
    if (!typeName) {
      throw new HandlerArgumentError('Typename should be set', typeName);
    }

    if (!message) {
      throw new HandlerArgumentError('Message should be set', message);
    }

    this.log(LoggerLevel.error, typeName, message, { error, caught });
  }

  /**
   * Logs a message
   *
   * @param level Severity level of the log
   * @param typeName The location of the log
   * @param message Message that should be logged
   * @param data Any relevant data that should be logged
   */
  abstract log(level: LoggerLevel, typeName: string, message: string, data?: any): void;

}
