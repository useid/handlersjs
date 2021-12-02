import { lastValueFrom } from 'rxjs';
import { HttpHandlerContext } from '../models/http-handler-context';
import { MockHttpHandler } from './http.handler.mock';

describe('MockHttpHandler', () => {

  let handler: MockHttpHandler;
  let context: HttpHandlerContext;

  beforeEach(() => {

    handler = new MockHttpHandler();
    context = { request: { headers: {}, method: 'GET', url: new URL('http://example.com') } };

  });

  it('should be correctly instantiated', () => {

    expect(handler).toBeTruthy();

  });

  describe('handle', () => {

    it('should return a response with body: "some mock output", status: 200, header: {}', async () => {

      await expect(lastValueFrom(handler.handle(context))).resolves.toEqual({ body: 'some mock output', status: 200, headers: {} });

    });

    it('should throw an error when called with null or undefined', async () => {

      await expect(lastValueFrom(handler.handle(null))).rejects.toThrow('Context cannot be null or undefined');
      await expect(lastValueFrom(handler.handle(undefined))).rejects.toThrow('Context cannot be null or undefined');

    });

  });

  describe('canHandle', () => {

    it('should return true if context is not undefined', async () => {

      await expect(lastValueFrom(handler.canHandle(context))).resolves.toEqual(true);

    });

    it('should throw an error when called with null or undefined', async () => {

      await expect(lastValueFrom(handler.canHandle(null))).rejects.toThrow('Context cannot be null or undefined');
      await expect(lastValueFrom(handler.canHandle(undefined))).rejects.toThrow('Context cannot be null or undefined');

    });

  });

});
