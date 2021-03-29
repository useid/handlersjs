/* eslint-disable no-console -- this is a logger service */

import { LoggerLevel } from './logger-level';

export abstract class Logger {
  abstract info(typeName: string, message: string, data?: any);
  abstract debug(typeName: string, message: string, data?: any);
  abstract error(typeName: string, message: string, error?: Error | any, caught?: any);
  abstract log(level: LoggerLevel, typeName: string, message: string, data?: any);
}
