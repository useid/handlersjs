import { lastValueFrom, of } from 'rxjs';
import { Handler } from '@useid/handlersjs-core';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpSequenceHandler } from './http-sequence-handler';

describe('HttpSequenceHandler', () => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockHandler: Handler<void, void> = { handle: (input: void) => of(void (0)) };
  let httpSequenceHandler: HttpSequenceHandler<HttpHandlerContext>;
  let mockContext: HttpHandlerContext;

  beforeEach(async () => {

    httpSequenceHandler = new HttpSequenceHandler([ mockHandler ]);

    mockContext = {
      request: {
        method: 'GET',
        url: new URL('http://localhost:3000/'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    };

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(httpSequenceHandler).toBeTruthy();

  });

  describe('handle', () => {

    it('should call the nested handlers handler', async () => {

      mockHandler.handle = jest.fn().mockReturnValue(of(void (0)));

      await lastValueFrom(httpSequenceHandler.handle(mockContext));

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockHandler.handle).toHaveBeenCalledTimes(1);

    });

  });

});
