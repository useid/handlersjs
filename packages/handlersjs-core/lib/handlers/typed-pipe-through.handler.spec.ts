/* eslint-disable @typescript-eslint/unbound-method */
import { of, lastValueFrom } from 'rxjs';
import { Handler } from './handler';
import { TypedPipeThroughHandler } from './typed-pipe-through.handler';

type HandlerSequenceOne<A, B> = [ Handler<A, B> ];
type HandlerSequenceTwo<A, B, C> = [ Handler<A, B>, Handler<B, C> ];

describe('TypedPipeThroughHandler', () => {

  let pipeThroughOne: TypedPipeThroughHandler<number, number, number, number, number>;
  let pipeThroughTwo: TypedPipeThroughHandler<number, number, number, number, number>;

  const mockHandler: Handler<number, number> = { handle: (input: number) => of(2 * input) };
  const mockHandler2: Handler<number, number> = { handle: (input: number) => of(4 * input) };

  const handlersOne: HandlerSequenceOne<number, number> = [ mockHandler ];
  const handlersTwo: HandlerSequenceTwo<number, number, number> = [ mockHandler, mockHandler2 ];

  beforeEach(() => {

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

  it('should error when no handlers were provided', () => {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    expect(() => new TypedPipeThroughHandler(null as unknown as any)).toThrow('Argument handlers should be set.');

  });

  it('should pass on the input to every next handler', async() => {

    let response = await lastValueFrom(pipeThroughOne.handle(5));

    expect(response).toBe(10);

    response = await lastValueFrom(pipeThroughTwo.handle(5));

    expect(response).toBe(40);

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
