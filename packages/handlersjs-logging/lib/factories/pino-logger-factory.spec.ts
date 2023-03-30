/* eslint-disable @typescript-eslint/dot-notation */
import { PinoLoggerFactory } from './pino-logger-factory';

describe('PinoLoggerFactory', () => {

  let loggerFactory: PinoLoggerFactory;

  beforeEach(async () => {

    loggerFactory = new PinoLoggerFactory();

  });

  it('should be correctly instantiated', () => {

    expect(loggerFactory).toBeTruthy();

  });

  describe('createLogger', () => {

    it('should create a logger with prettyPrint set to false if no logger options were passed', async () => {

      const logger = loggerFactory.createLogger('test-logger', 5, 5);

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(5);
      expect(logger['minimumLevelPrintData']).toEqual(5);
      expect(logger['prettyPrint']).toEqual(false);

    });

    it('should create a logger with prettyPrint set to false if it was passed in the loggerOptions', async () => {

      const logger = loggerFactory.createLogger('test-logger', 5, 5, { prettyPrint: false });

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(5);
      expect(logger['minimumLevelPrintData']).toEqual(5);
      expect(logger['prettyPrint']).toEqual(false);

    });

    it('should create a logger with prettyPrint set to true if it was passed in the loggerOptions', async () => {

      const logger = loggerFactory.createLogger('test-logger', 5, 5, { prettyPrint: true });

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(5);
      expect(logger['minimumLevelPrintData']).toEqual(5);
      expect(logger['prettyPrint']).toEqual(true);

    });

  });

});
