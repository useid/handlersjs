import { of } from 'rxjs';
import { Handler } from './handler';
import { PassThroughHandler } from './pass-through.handler';

describe('PassThroughHandler', () => {

  const input = {
    msg: 'input',
  };

  const intermediateOutput = {
    msg: 'output',
  };

  const nestedHandler: Handler<unknown, unknown> = {
    handle: jest.fn().mockReturnValue(of(intermediateOutput)),
    canHandle: jest.fn(),
    safeHandle: jest.fn(),
  };

  const handler = new PassThroughHandler(nestedHandler);

  it('should be correctly instantiated', () => {

    const newHandler = new PassThroughHandler(nestedHandler);
    expect(newHandler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new PassThroughHandler(null)).toThrow('Argument handler should be set.');

  });

  describe('canHandle', () => {

    it('should return true if input and intermediateOutput was provided', async () => {

      await expect(handler.canHandle(input, intermediateOutput).toPromise()).resolves.toEqual(true);

    });

  });

  describe('handle', () => {

    it('should handle the input and intermediateOutput', async () => {

      await expect(handler.handle(input, intermediateOutput).toPromise()).resolves.toEqual({ msg: 'output' });

    });

    it('should call the nested handler', async () => {

      await handler.handle(input, intermediateOutput).toPromise();
      expect(nestedHandler.handle).toHaveBeenCalledWith(input, intermediateOutput);

    });

  });

});
