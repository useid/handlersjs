/* eslint-disable @typescript-eslint/dot-notation */
import { LoggerLevel } from '../models/logger-level';
import { PinoLoggerFactory } from './pino-logger-factory';

describe('PinoLoggerFactory', () => {

  let loggerFactory: PinoLoggerFactory;

  beforeEach(async () => {

    loggerFactory = new PinoLoggerFactory(
      { minimumLevel: LoggerLevel.trace, minimumLevelPrintData: LoggerLevel.trace },
    );

  });

  it('should be correctly instantiated', () => {

    expect(loggerFactory).toBeTruthy();

  });

  describe('createLogger', () => {

    it('should create a logger with prettyPrint set to false if no logger options were passed', async () => {

      const logger = loggerFactory.createLogger('test-logger');

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(LoggerLevel.trace);
      expect(logger['minimumLevelPrintData']).toEqual(LoggerLevel.trace);
      expect(logger['prettyPrint']).toEqual(false);

    });

    it('should create a logger with prettyPrint set to true', async () => {

      const logger = loggerFactory.createLogger('test-logger', { minimumLevel: LoggerLevel.trace, minimumLevelPrintData: LoggerLevel.trace, prettyPrint: true });

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(LoggerLevel.trace);
      expect(logger['minimumLevelPrintData']).toEqual(LoggerLevel.trace);
      expect(logger['prettyPrint']).toEqual(true);

    });

  });

});
