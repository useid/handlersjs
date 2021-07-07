import { of } from 'rxjs';
import { WaterfallHandler } from './waterfall.handler';
import { Handler } from './handler';

describe('WaterfallHandler', () => {

  const input = {
    msg: 'input',
  };

  const intermediateOutput = {
    msg: 'output',
  };

  const nestedHandler = {
    handle: jest.fn().mockReturnValue(of(input)),
    canHandle: jest.fn().mockReturnValue(of(true)),
    safeHandle: jest.fn().mockReturnValue(of(intermediateOutput)),
  };

  const handlers: Handler<unknown, unknown>[] = [ nestedHandler ];
  const handler = new WaterfallHandler(handlers);

  it('should be correctly instantiated', () => {

    expect(handler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new WaterfallHandler(null)).toThrow('Argument handlers should be set.');

  });

  describe('canHandle', () => {

    it('should return true if input  was provided', async () => {

      await expect(handler.canHandle(input, intermediateOutput).toPromise()).resolves.toEqual(true);

    });

    it('should return false if input was not provided', async () => {

      await expect(handler.canHandle(null, intermediateOutput).toPromise()).resolves.toEqual(false);
      await expect(handler.canHandle(undefined, intermediateOutput).toPromise()).resolves.toEqual(false);

    });

    it('should return false if intermediateOutput was not provided', async () => {

      await expect(handler.canHandle(input, null).toPromise()).resolves.toEqual(false);
      await expect(handler.canHandle(input, undefined).toPromise()).resolves.toEqual(false);

    });

  });

  describe('handle', () => {

    it('should throw an error if no input was provided', async () => {

      await expect(() => handler.handle(null, intermediateOutput).toPromise()).rejects.toThrow('Argument input should be set.');
      await expect(() => handler.handle(undefined, intermediateOutput).toPromise()).rejects.toThrow('Argument input should be set.');

    });

    it('should return the input if no intermediateOutput was provided', async () => {

      await expect(handler.handle(input, undefined)
        .toPromise()).resolves.toEqual(input);

    });

    it('should return the intermediateOutput if no handlerToExecute was received', async () => {

      nestedHandler.canHandle = jest.fn().mockReturnValue(of());
      await expect(handler.handle(input, intermediateOutput).toPromise()).resolves.toEqual(intermediateOutput);

    });

  });

});
