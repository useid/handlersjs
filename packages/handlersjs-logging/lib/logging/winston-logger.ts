import util from 'util';
import { transports, createLogger, format, Logger } from 'winston';
import { HandlerArgumentError } from '@digita-ai/handlersjs-core';
import { TransformableInfo } from 'logform';
import { Logger as DGTLogger } from './logger';
import { LoggerLevel } from './logger-level';

/**
 * Winston-based logger service
 */
export class WinstonLogger extends DGTLogger {

  private logger: Logger;

  constructor(
    protected readonly minimumLevel: LoggerLevel,
    protected readonly minimumLevelPrintData: LoggerLevel,
  ) {

    super(minimumLevel, minimumLevelPrintData);

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

  log(level: LoggerLevel, typeName: string, message: string, data?: unknown): void {

    if (level === null || level === undefined) {

      throw new HandlerArgumentError('Argument level should be set', typeName);

    }

    if (!typeName) {

      throw new HandlerArgumentError('Argument typeName should be set', typeName);

    }

    if (!message) {

      throw new HandlerArgumentError('Argument message should be set', message);

    }

    const logLevel = LoggerLevel[level];
    const printData = level <= this.minimumLevelPrintData;

    if (level <= this.minimumLevel) {

      this.logger.log({ level: logLevel, message, typeName, data, printData });

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
