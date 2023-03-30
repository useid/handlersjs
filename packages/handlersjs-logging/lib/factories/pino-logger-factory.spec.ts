/* eslint-disable @typescript-eslint/dot-notation */
import { PinoLoggerFactory } from './pino-logger-factory';

describe('PinoLoggerFactory', () => {

  let loggerFactory: PinoLoggerFactory;

  beforeEach(async () => {

    loggerFactory = new PinoLoggerFactory({ minimumLevel: 5, minimumLevelPrintData: 5, prettyPrint: false });

  });

  it('should be correctly instantiated', () => {

    expect(loggerFactory).toBeTruthy();

  });

  describe('createLogger', () => {

    it('should create a logger with prettyPrint set to false if no logger options were passed', async () => {

      const logger = loggerFactory.createLogger('test-logger');

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(5);
      expect(logger['minimumLevelPrintData']).toEqual(5);
      expect(logger['prettyPrint']).toEqual(false);

    });

    it('should create a logger with specified minimumLevel, minimumLevelForPrintData and prettyPrint', async () => {

      const logger = loggerFactory.createLogger('test-logger', { minimumLevel: 3, minimumLevelPrintData: 3, prettyPrint: true });

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(3);
      expect(logger['minimumLevelPrintData']).toEqual(3);
      expect(logger['prettyPrint']).toEqual(true);

    });

    it('should create a logger with specified minimumLevel, minimumLevelForPrintData', async () => {

      const logger = loggerFactory.createLogger('test-logger', { minimumLevel: 3, minimumLevelPrintData: 3 });

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(3);
      expect(logger['minimumLevelPrintData']).toEqual(3);
      expect(logger['prettyPrint']).toEqual(false);

    });

  });

});
