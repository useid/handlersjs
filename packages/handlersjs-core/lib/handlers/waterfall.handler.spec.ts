/* eslint-disable @typescript-eslint/unbound-method */
import { lastValueFrom, of, throwError } from 'rxjs';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { Handler } from './handler';
import { WaterfallHandler } from './waterfall.handler';

describe('WaterfallHandler', () => {

  const input = 'input';
  const output = 'output';
  const error = 'error';

  let ableHandler: Handler<string, string>;
  let unableHandler: Handler<string, string>;

  beforeEach(() => {

    ableHandler = { handle: jest.fn().mockReturnValue(of(output)) };
    unableHandler = { handle: jest.fn().mockReturnValue(throwError(() => error)) };

  });

  it('should be correctly instantiated', () => {

    const newHandler = new WaterfallHandler([ ableHandler ]);

    expect(newHandler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new WaterfallHandler(null as unknown as Handler<unknown, unknown>[])).toThrow('Argument handlers should be set.');

  });

  describe('handle', () => {

    it('should return the output of the first nested handler that can handle it', async () => {

      const handler = new WaterfallHandler([ unableHandler, ableHandler ]);

      const result = await lastValueFrom(handler.handle(input));

      expect(ableHandler.handle).toHaveBeenCalledTimes(1);
      expect(result).toEqual(output);

    });

    it('should not call further nested handlers if an earlier one can handle the input', async () => {

      const handler = new WaterfallHandler([ ableHandler, unableHandler ]);

      await lastValueFrom(handler.handle(input));

      expect(unableHandler.handle).not.toHaveBeenCalled();

    });

    it('should throw an error if no handlerToExecute was found', async () => {

      const handler = new WaterfallHandler([ unableHandler ]);

      await expect(lastValueFrom(handler.handle(input)))
        .rejects.toThrow(new HandlerArgumentError('No handler can handle the input.', input));

    });

  });

});
