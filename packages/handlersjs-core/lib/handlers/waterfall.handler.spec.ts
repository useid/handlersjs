import { lastValueFrom, of } from 'rxjs';
import { HandlerArgumentError } from '../errors/handler-argument-error';
import { WaterfallHandler } from './waterfall.handler';
import { Handler } from './handler';

describe('WaterfallHandler', () => {

  const input = {
    msg: 'input',
  };

  const ableHandler = {
    handle: jest.fn().mockReturnValue(of(input)),
    canHandle: jest.fn().mockReturnValue(of(true)),
  };

  const unableHandler = {
    handle: jest.fn().mockReturnValue(of(input)),
    canHandle: jest.fn().mockReturnValue(of(false)),
  };

  it('should be correctly instantiated', () => {

    const newHandler = new WaterfallHandler([ ableHandler ]);
    expect(newHandler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new WaterfallHandler(null)).toThrow('Argument handlers should be set.');

  });

  describe('handle', () => {

    it('should call the handle of the first nested handler that can handle it', async () => {

      const handler = new WaterfallHandler([ unableHandler, ableHandler ]);

      await lastValueFrom(handler.handle(input));
      expect(ableHandler.handle).toHaveBeenCalledTimes(1);

    });

    it('should not call further nested handlers if an earlier one can handle the input', async () => {

      const handler = new WaterfallHandler([ ableHandler, unableHandler ]);

      await lastValueFrom(handler.handle(input));
      expect(unableHandler.handle).not.toHaveBeenCalled();

    });

    it('should throw an error if no handlerToExecute was found', async () => {

      const handler = new WaterfallHandler([ unableHandler ]);
      expect(lastValueFrom(handler.handle(input))).rejects.toThrow(new HandlerArgumentError('No handler can handle the input.', input));

    });

  });

});
