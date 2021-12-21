import { of, lastValueFrom } from 'rxjs';
import { Handler } from './handler';
import { TypedPipeThroughHandler } from './typed-pipe-through.handler';

type HandlerSequenceOne<A, B> = [ Handler<A, B> ];
type HandlerSequenceTwo<A, B, C> = [ Handler<A, B>, Handler<B, C> ];

describe('TypedPipeThroughHandler', () => {

  const nestedHandler = { handle: jest.fn(), canHandle: jest.fn() };
  const handlers: HandlerSequenceOne<unknown, unknown> = [ nestedHandler ];

  let pipeThroughOne;
  let pipeThroughTwo;

  const mockHandler: Handler<number, number> = {
    handle: (input: number) => of(2 * input),
    canHandle: (input) => of(true),
  };

  const mockHandler2: Handler<number, number> = {
    handle: (input: number) => of(4 * input),
    canHandle: (input) => of(true),
  };

  const handlersOne: HandlerSequenceOne<number, number> = [ mockHandler ];
  const handlersTwo: HandlerSequenceTwo<number, number, number> = [ mockHandler, mockHandler2 ];

  beforeEach(async () => {

    pipeThroughOne = new TypedPipeThroughHandler(handlersOne);
    pipeThroughTwo = new TypedPipeThroughHandler(handlersTwo);

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(pipeThroughOne).toBeTruthy();
    expect(pipeThroughTwo).toBeTruthy();

  });

  it('should error when no handlers were provided', async() => {

    expect(() => new TypedPipeThroughHandler(null)).toThrow('Argument handlers should be set.');

  });

  it('should pass on the input to every next handler', async() => {

    let response = await lastValueFrom(pipeThroughOne.handle(5));
    expect(response).toEqual(10);
    response = await lastValueFrom(pipeThroughTwo.handle(5));
    expect(response).toEqual(40);

  });

  describe('handle', () => {

    it('should call the nested handlers handler', async () => {

      mockHandler.handle = jest.fn().mockReturnValue(of(10));
      mockHandler2.handle = jest.fn().mockReturnValue(of(20));

      await lastValueFrom(pipeThroughTwo.handle(5));

      expect(mockHandler.handle).toHaveBeenCalledTimes(1);
      expect(mockHandler2.handle).toHaveBeenCalledTimes(1);

      expect(mockHandler.handle).toHaveBeenCalledWith(5);
      expect(mockHandler2.handle).toHaveBeenCalledWith(10);

    });

  });

});
