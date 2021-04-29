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

  it('should pass on the input to every next handler', async() => {
    let response = await pipeThroughOne.handle(5).toPromise();
    expect(response).toEqual(10);
    response = await pipeThroughTwo.handle(5).toPromise();
    expect(response).toEqual(40);
  });
});
