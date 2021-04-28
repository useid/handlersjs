import { ConsoleLogger } from '@digita-ai/handlersjs-core';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpContentNegotiationHandler } from './http-content-negotiation.handler';
import { MockHttpHandler } from './http.handler.mock';

const logger = new ConsoleLogger(6, 6);

describe('ServerHandlerContentNegotiationService', () => {
  let handler: HttpContentNegotiationHandler;
  let mockCTX: HttpHandlerContext;

  beforeEach(() => {
    handler = new HttpContentNegotiationHandler(
      new MockHttpHandler(),
      logger,
      'application/ld+json',
    );

    mockCTX = {
      request: {
        headers: {
          accept: '*/*',
        },
        url: new URL('http://example.com'),
        method: 'GET',
      },
    };
  });

  it('should be correctly instantiated', () => {
    expect(handler).toBeTruthy();
  });

  describe('canhandle()', () => {
    it('should return true when accept header = */*', async() => {
      mockCTX.request.headers.accept = '*/*';
      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toBe(true);
    });
    it('should return true when accept header = text/turtle', async() => {
      mockCTX.request.headers.accept = 'text/turtle';
      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toBe(true);
    });
    it('should return false when accept header = application/json', async() => {
      mockCTX.request.headers.accept = 'application/json';
      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toBe(false);
    });
  });

  describe('handle()', () => {
    it('throws when context.request is null', async() => {
      await expect(handler.handle({ ...mockCTX, request: null }).toPromise()).rejects.toThrow(
        'Argument request should be set.',
      );
    });
    it('should return 406 for unknown content types', async() => {
      mockCTX.request.headers.accept = 'unsupportedContentType';
      const temp = await handler.handle(mockCTX).toPromise();
      await expect(temp.status).toBe(406);
    });
  });
});
