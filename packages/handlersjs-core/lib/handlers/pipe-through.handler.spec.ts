import { of } from 'rxjs';
import { PipeThroughHandler } from './pipe-through.handler';
import { Handler } from './handler';

describe('PipeThroughHandler', () => {

  let pipeThroughOne;
  let pipeThroughTwo;

  const mockHandler: Handler<number, number> = {
    handle: (input: number) => of(2 * input),
    canHandle: (input) => of(true),
    safeHandle: (input: number) => of(2 * input),
  };

  const mockHandler2: Handler<number, number> = {
    handle: (input: number) => of(4 * input),
    canHandle: (input) => of(true),
    safeHandle: (input: number) => of(4 * input),
  };

  beforeEach(async () => {

    pipeThroughOne = new PipeThroughHandler([ mockHandler ]);
    pipeThroughTwo = new PipeThroughHandler([ mockHandler, mockHandler2 ]);

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(pipeThroughOne).toBeTruthy();
    expect(pipeThroughTwo).toBeTruthy();

  });

  it('should error when no handlers were provided', async() => {

    expect(() => new PipeThroughHandler(null)).toThrow('Argument handlers should be set.');

  });

  it('should pass on the input to every next handler', async() => {

    let response = await pipeThroughOne.handle(5).toPromise();
    expect(response).toEqual(10);
    response = await pipeThroughTwo.handle(5).toPromise();
    expect(response).toEqual(40);

  });

  describe('canHandle', () => {

    it('should return true if input was provided', async () => {

      await expect(pipeThroughOne.canHandle({}).toPromise()).resolves.toEqual(true);

    });

    it('should return false if input was not provided', async () => {

      await expect(pipeThroughOne.canHandle(null).toPromise()).resolves.toEqual(false);
      await expect(pipeThroughOne.canHandle(undefined).toPromise()).resolves.toEqual(false);

    });

  });

  describe('handle', () => {

    it('should error if no input was provided', async () => {

      await expect(pipeThroughOne.handle(null).toPromise()).rejects.toEqual(new Error('Argument input should be set.'));

    });

    it('should call the nested handlers handler', async () => {

      mockHandler.handle = jest.fn().mockReturnValue(of());

      await pipeThroughOne.handle(5).toPromise();

      expect(mockHandler.handle).toHaveBeenCalledTimes(1);

    });

  });

});
