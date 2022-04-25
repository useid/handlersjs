import { lastValueFrom, of } from 'rxjs';
import { SequenceHandler } from './sequence.handler';
import { Handler } from './handler';

describe('SequenceHandler', () => {

  let pipeThroughOne;
  let pipeThroughTwo;

  const mockHandler: Handler<number, number> = { handle: (input: number) => of(2 * input) };
  const mockHandler2: Handler<number, number> = { handle: (input: number) => of(4 * input) };

  beforeEach(async () => {

    pipeThroughOne = new SequenceHandler([ mockHandler ]);
    pipeThroughTwo = new SequenceHandler([ mockHandler, mockHandler2 ]);

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(pipeThroughOne).toBeTruthy();
    expect(pipeThroughTwo).toBeTruthy();

  });

  it('should error when no handlers were provided', async() => {

    expect(() => new SequenceHandler(null)).toThrow('Argument handlers should be set.');

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
