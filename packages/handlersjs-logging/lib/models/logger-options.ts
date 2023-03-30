import { LoggerLevel } from './logger-level';

export interface LoggerOptions {
  minimumLevel: LoggerLevel;
  minimumLevelPrintData: LoggerLevel;
}

export interface PinoLoggerOptions extends LoggerOptions {
  prettyPrint?: boolean;
}
