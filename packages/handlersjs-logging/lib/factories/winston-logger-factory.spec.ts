/* eslint-disable @typescript-eslint/dot-notation */
import { WinstonLoggerFactory } from './winston-logger-factory';

describe('WinstonLoggerFactory', () => {

  let loggerFactory: WinstonLoggerFactory;

  beforeEach(async () => {

    loggerFactory = new WinstonLoggerFactory();

  });

  it('should be correctly instantiated', () => {

    expect(loggerFactory).toBeTruthy();

  });

  describe('createLogger', () => {

    it('should create a logger', async () => {

      const logger = loggerFactory.createLogger('test-logger', 5, 5);

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(5);
      expect(logger['minimumLevelPrintData']).toEqual(5);

    });

  });

});
