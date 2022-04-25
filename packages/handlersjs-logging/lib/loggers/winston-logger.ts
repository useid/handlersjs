import * as util from 'util';
import { transports, createLogger, format, Logger as WLogger } from 'winston';
import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import { TransformableInfo } from 'logform';
import { Logger } from '../models/logger';
import { LoggerLevel } from '../models/logger-level';

/**
 * Winston-based logger service
 */
export class WinstonLogger extends Logger {

  private logger: WLogger;

  constructor(
    protected readonly label: string,
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
  ) {

    super(label, minimumLevel, minimumLevelPrintData);

    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.printf(this.formatLog),
      ),
      level: LoggerLevel[this.minimumLevel],
      transports: [
        new transports.File({ filename: 'api-error.log', level: 'error' }),
        new transports.Console(),
      ],
    });

  }

  log(level: LoggerLevel, message: string, data?: unknown): void {

    if (level === null || level === undefined) {

      throw new HandlerArgumentError('Argument level should be set', this.label);

    }

    if (!message) {

      throw new HandlerArgumentError('Argument message should be set', message);

    }

    const logLevel = LoggerLevel[level];
    const printData = level <= this.minimumLevelPrintData;

    if (level <= this.minimumLevel) {

      this.logger.log({ level: logLevel, message, typeName: this.label, data, printData });

    }

  }

  /**
   * Formats log info
   *
   * @param info The log info to format
   * @returns The formatted string
   */
  private formatLog(info: TransformableInfo): string {

    return info.printData
      ? `[${info.timestamp} ${info.typeName}] ${info.message}${info.data ? `\n${util.inspect(info.data)}` : ''}`
      : `[${info.timestamp} ${info.typeName}] ${info.message}`;

  }

}
