import { lastValueFrom } from 'rxjs';
import { Handler } from './handler';
import { TypedPipeThroughHandler } from './typed-pipe-through.handler';

type HandlerSequence1<A, B> = [ Handler<A, B> ];

describe('TypedPipeThroughHandler', () => {

  const nestedHandler = { handle: jest.fn(), canHandle: jest.fn() };
  const handlers: HandlerSequence1<unknown, unknown> = [ nestedHandler ];
  const handler = new TypedPipeThroughHandler(handlers);

  const input = {
    msg: 'input',
  };

  it('should be correctly instantiated', () => {

    expect(handler).toBeTruthy();

  });

  it('should error when no handler was provided', () => {

    expect(() => new TypedPipeThroughHandler(null)).toThrow('Argument handlers should be set.');

  });

  describe('canHandle', () => {

    it('should return true if input was provided', async () => {

      await expect(lastValueFrom(handler.canHandle({}))).resolves.toEqual(true);

    });

    it('should return true if input was not provided', async () => {

      await expect(lastValueFrom(handler.canHandle(undefined))).resolves.toEqual(true);

    });

  });

});
