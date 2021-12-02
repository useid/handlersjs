import { lastValueFrom, Observable, of } from 'rxjs';
import { Handler } from './handler';

describe('Handler', () => {

  class MockHandler extends Handler<unknown, unknown> {

    constructor() {

      super();

    }

    canHandle(input: unknown, intermediateOutput?: unknown): Observable<boolean> {

      throw new Error('Method not implemented.');

    }
    handle(input: unknown, intermediateOutput?: unknown): Observable<unknown> {

      throw new Error('Method not implemented.');

    }

  }

  const mockedHandlerObject = new MockHandler();

  const mockInput = {
    input: 'input',
  };

  const mockIntermediateOutput = {
    intermediateOutput: 'output',
  };

  describe('safeHandle', () => {

    it('should call canHandle and handle if canHandleResult is true', async () => {

      mockedHandlerObject.handle = jest.fn().mockReturnValue(of({}));
      mockedHandlerObject.canHandle = jest.fn().mockReturnValue(of(true));
      await lastValueFrom(mockedHandlerObject.safeHandle(mockInput, mockIntermediateOutput));
      expect(mockedHandlerObject.canHandle).toHaveBeenCalledTimes(1);
      expect(mockedHandlerObject.handle).toHaveBeenCalledTimes(1);

    });

    it('should not call handle if canHandleResult is false', async () => {

      mockedHandlerObject.handle = jest.fn().mockReturnValue(of({}));
      mockedHandlerObject.canHandle = jest.fn().mockReturnValue(of(false));
      await lastValueFrom(mockedHandlerObject.safeHandle(mockInput, null));
      expect(mockedHandlerObject.canHandle).toHaveBeenCalledTimes(1);
      expect(mockedHandlerObject.handle).toHaveBeenCalledTimes(0);

    });

  });

});
