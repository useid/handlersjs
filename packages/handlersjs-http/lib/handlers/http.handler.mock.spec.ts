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

      await expect(lastValueFrom(handler.handle(context))).resolves.toEqual({
        body: expect.any(Buffer),
        status: 200,
        headers: {},
      });

    });

  });

});
