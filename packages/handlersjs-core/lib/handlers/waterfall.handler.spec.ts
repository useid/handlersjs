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

  const nestedHandler2 = {
    handle: jest.fn().mockReturnValue(of(input)),
    canHandle: jest.fn().mockReturnValue(of(true)),
    safeHandle: jest.fn().mockReturnValue(of(intermediateOutput)),
  };

  const nestedHandler3 = {
    handle: jest.fn().mockReturnValue(of(input)),
    canHandle: jest.fn().mockReturnValue(of(true)),
    safeHandle: jest.fn().mockReturnValue(of(intermediateOutput)),
  };

  const handlers: Handler<unknown, unknown>[] = [ nestedHandler, nestedHandler2, nestedHandler3 ];
  const handler = new WaterfallHandler(handlers);

  it('should be correctly instantiated', () => {

    const newHandler = new WaterfallHandler(handlers);
    expect(newHandler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new WaterfallHandler(null)).toThrow('Argument handlers should be set.');

  });

  describe('canHandle', () => {

    it('should return true if input  was provided', async () => {

      await expect(handler.canHandle(input, intermediateOutput).toPromise()).resolves.toEqual(true);

    });

  });

  describe('handle', () => {

    it('should call the handle of the first nested handler that can handle it', async () => {

      nestedHandler.canHandle = jest.fn().mockReturnValue(of(false));
      await handler.handle(input, undefined).toPromise();
      expect(nestedHandler2.handle).toHaveBeenCalledTimes(1);

    });

    it('should return the input and generated output if no intermediate output was provided', async () => {

      nestedHandler.canHandle = jest.fn().mockReturnValue(of(true));
      await handler.handle(input, undefined).toPromise();
      expect(nestedHandler2.handle).toHaveBeenCalledWith(input, { body: null, status: 200, headers: {} });

    });

    it('should return intermediateOutput if no handlerToExecute was found', async () => {

      nestedHandler.canHandle = jest.fn().mockReturnValue(of(false));
      nestedHandler2.canHandle = jest.fn().mockReturnValue(of(false));
      nestedHandler3.canHandle = jest.fn().mockReturnValue(of(false));
      expect(handler.handle(input, intermediateOutput).toPromise()).resolves.toEqual(intermediateOutput);

    });

  });

});
