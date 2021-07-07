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

    it('should return false if input was not provided', async () => {

      await expect(handler.canHandle(null, intermediateOutput).toPromise()).resolves.toEqual(false);
      await expect(handler.canHandle(undefined, intermediateOutput).toPromise()).resolves.toEqual(false);

    });

    // it('should return false if intermediateOutput was not provided', async () => {

    //   await expect(handler.canHandle(input, null).toPromise()).resolves.toEqual(false);
    //   await expect(handler.canHandle(input, undefined).toPromise()).resolves.toEqual(false);

    // });

    it('should return false if no arguments were provided', async () => {

      await expect(handler.canHandle(null, null).toPromise()).resolves.toEqual(false);
      await expect(handler.canHandle(undefined, undefined).toPromise()).resolves.toEqual(false);

    });

  });

  describe('handle', () => {

    it('should throw an error if no input was provided', async () => {

      await expect(handler.handle(null, intermediateOutput).toPromise()).rejects.toThrow('Argument input should be set.');
      await expect(handler.handle(undefined, intermediateOutput).toPromise()).rejects.toThrow('Argument input should be set.');

    });

    it('should set intermediateOutput as an unknown empty request object if none was provided', async () => {

      await expect(handler.handle(input).toPromise()).resolves.toEqual({ body: null, status: 200, headers: {} });

    });

    it('should call the handlers safeHandle', async () => {

      const nestedHandler = { handle: jest.fn(), canHandle: jest.fn(), safeHandle: jest.fn().mockReturnValue(of()) };
      const newHandler = new SequenceHandler<unknown, unknown>([ nestedHandler ]);

      await newHandler.handle(input, intermediateOutput).toPromise();

      expect(nestedHandler.safeHandle).toHaveBeenCalledTimes(1);

    });

  });

});
