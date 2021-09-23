import { of } from 'rxjs';
import { Handler } from './handler';
import { SequenceHandler } from './sequence.handler';

describe('SequenceHandler', () => {

  const handlers: Handler<unknown>[] = [];
  const handler = new SequenceHandler<unknown, unknown>(handlers);

  const input = {
    msg: 'input',
  };

  const intermediateOutput = {
    msg: 'output',
  };

  it('should be correctly instantiated', () => {

    expect(handler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new SequenceHandler(null)).toThrow('Argument handlers should be set.');

  });

  describe('canHandle', () => {

    it('should return true if input and intermediateOutput was provided', async () => {

      await expect(handler.canHandle(input, intermediateOutput).toPromise()).resolves.toEqual(true);

    });

  });

  describe('handle', () => {

    it('should set intermediateOutput as an unknown empty request object if none was provided', async () => {

      await expect(handler.handle(input).toPromise()).resolves.toEqual({ body: null, status: 200, headers: {} });

    });

    it('should call all the nested handlers safeHandles', async () => {

      const nestedHandler = {
        handle: jest.fn(),
        canHandle: jest.fn(),
        safeHandle: jest.fn().mockReturnValue(of(intermediateOutput)),
      };

      const nestedHandler2 = {
        handle: jest.fn(),
        canHandle: jest.fn(),
        safeHandle: jest.fn().mockReturnValue(of(intermediateOutput)),
      };

      const nestedHandler3 = {
        handle: jest.fn(),
        canHandle: jest.fn().mockReturnValue(of(false)),
        safeHandle: jest.fn().mockReturnValue(of(intermediateOutput)),
      };

      const newHandler = new SequenceHandler<unknown, unknown>([ nestedHandler, nestedHandler2, nestedHandler3 ]);

      await newHandler.handle(input, intermediateOutput).toPromise();

      expect(nestedHandler.safeHandle).toHaveBeenCalledTimes(1);
      expect(nestedHandler2.safeHandle).toHaveBeenCalledTimes(1);
      expect(nestedHandler3.safeHandle).toHaveBeenCalledTimes(1);

      expect(nestedHandler.safeHandle).toHaveBeenCalledWith(input, intermediateOutput);
      expect(nestedHandler2.safeHandle).toHaveBeenCalledWith(input, intermediateOutput);
      expect(nestedHandler3.safeHandle).toHaveBeenCalledWith(input, intermediateOutput);

    });

  });

});
