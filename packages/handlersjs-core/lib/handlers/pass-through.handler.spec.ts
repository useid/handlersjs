/* eslint-disable @typescript-eslint/unbound-method */
import { of, lastValueFrom } from 'rxjs';
import { Handler } from './handler';
import { PassThroughHandler } from './pass-through.handler';

describe('PassThroughHandler', () => {

  const input = {
    msg: 'input',
  };

  const nestedOutput = {
    msg: 'output',
  };

  const nestedHandler: Handler<unknown, unknown> = { handle: jest.fn().mockReturnValue(of(nestedOutput)) };

  const handler = new PassThroughHandler(nestedHandler);

  it('should be correctly instantiated', () => {

    const newHandler = new PassThroughHandler(nestedHandler);

    expect(newHandler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new PassThroughHandler((null as unknown as Handler<unknown, unknown>))).toThrow('Argument handler should be set.');

  });

  describe('handle', () => {

    it('should handle the input', async () => {

      await expect(lastValueFrom(handler.handle(input))).resolves.toEqual(input);

    });

    it('should call the nested handler', async () => {

      await lastValueFrom(handler.handle(input));

      expect(nestedHandler.handle).toHaveBeenCalledWith(input);

    });

  });

});
