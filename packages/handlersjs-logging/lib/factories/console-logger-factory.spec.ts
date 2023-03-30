/* eslint-disable @typescript-eslint/dot-notation */
import { ConsoleLoggerFactory } from './console-logger-factory';

describe('ConsoleLoggerFactory', () => {

  let loggerFactory: ConsoleLoggerFactory;

  beforeEach(async () => {

    loggerFactory = new ConsoleLoggerFactory({ minimumLevel: 5, minimumLevelPrintData: 5 });

  });

  it('should be correctly instantiated', () => {

    expect(loggerFactory).toBeTruthy();

  });

  describe('createLogger', () => {

    it('should create a logger', async () => {

      const logger = loggerFactory.createLogger('test-logger');

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(5);
      expect(logger['minimumLevelPrintData']).toEqual(5);

    });

    it('should create a logger with specified minimumLevel and minimumLevelForPrintData', async () => {

      const logger = loggerFactory.createLogger('test-logger', { minimumLevel: 3, minimumLevelPrintData: 3 });

      expect(logger['label']).toEqual('test-logger');
      expect(logger['minimumLevel']).toEqual(3);
      expect(logger['minimumLevelPrintData']).toEqual(3);

    });

  });

});
