/* eslint-disable @typescript-eslint/dot-notation */
import { ConsoleLoggerFactory } from './console-logger-factory';

describe('ConsoleLoggerFactory', () => {

  let loggerFactory: ConsoleLoggerFactory;

  beforeEach(async () => {

    loggerFactory = new ConsoleLoggerFactory();

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
