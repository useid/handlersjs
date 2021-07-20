import { MemoryStore } from '@digita-ai/handlersjs-core';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { JsonStoreHandler } from './json-store-handler';

describe('JsonStoreHandler', () => {

  interface StoreInterface {
    data: string[];
  }

  const inputData = [ 'abc', 'defghij', '123' ];
  const inputData2 = [ ... inputData, '456' ];

  let jsonStoreHandler: JsonStoreHandler<StoreInterface>;
  let memoryStore: MemoryStore<StoreInterface>;
  let requestContext: HttpHandlerContext;

  beforeEach(() => {

    memoryStore = new MemoryStore([ [ 'data', inputData ] ]);

    jsonStoreHandler = new JsonStoreHandler('data', memoryStore);

    requestContext = {
      request: {
        url: new URL('http://localhost/'),
        method: 'GET',
        headers: {},
      },
    };

  });

  describe('handle()', () => {

    it('can GET the data correctly', async () => {

      const response: HttpHandlerResponse = await jsonStoreHandler.handle(requestContext).toPromise();
      const resultData: string[] = JSON.parse(response.body);

      expect(resultData).toEqual(inputData);
      expect(response.status).toEqual(200);

    });

    it('can not use a wrong HTTP method', async () => {

      requestContext.request.method = 'POST';
      const response: HttpHandlerResponse = await jsonStoreHandler.handle(requestContext).toPromise();

      expect(response.status).toEqual(405);

    });

    it('returns "not found" if the data is not available', async () => {

      await memoryStore.delete('data');
      const response: HttpHandlerResponse = await jsonStoreHandler.handle(requestContext).toPromise();

      expect(response.status).toEqual(404);

    });

    it('can GET updated data', async () => {

      let response: HttpHandlerResponse = await jsonStoreHandler.handle(requestContext).toPromise();
      let resultData: string[] = JSON.parse(response.body);

      expect(resultData).toEqual(inputData);
      expect(response.status).toEqual(200);

      // update the data
      await memoryStore.set('data', inputData2);
      response = await jsonStoreHandler.handle(requestContext).toPromise();
      resultData = JSON.parse(response.body);

      expect(resultData).toEqual(inputData2);
      expect(response.status).toEqual(200);

    });

    describe('If-Modified-Since', () => {

      it('doesn\'t return the data if the data wasn\'t updated', async () => {

        const nextHour = new Date();
        nextHour.setTime(nextHour.getTime() + 60*60*1000);

        requestContext.request.headers['If-Modified-Since'] = nextHour.toUTCString();
        const response: HttpHandlerResponse = await jsonStoreHandler.handle(requestContext).toPromise();

        expect(response.status).toEqual(304); // not modified
        expect(response.body).toEqual('');

      });

      it('returns the data if it was updated', async () => {

        requestContext.request.headers['If-Modified-Since'] = new Date(1970).toUTCString();
        const response: HttpHandlerResponse = await jsonStoreHandler.handle(requestContext).toPromise();

        expect(response.status).toEqual(200);

        const resultData: string[] = JSON.parse(response.body);
        expect(resultData).toEqual(inputData);

      });

      it('can GET updated data with the if-modified-since parameter', async () => {

        const fiveSecondsAgo = new Date();
        fiveSecondsAgo.setTime(fiveSecondsAgo.getTime() - 5000);

        await memoryStore.set('data', inputData2);

        requestContext.request.headers['If-Modified-Since'] = fiveSecondsAgo.toUTCString();
        const response = await jsonStoreHandler.handle(requestContext).toPromise();

        expect(response.status).toEqual(200);

        const resultData: string[] = JSON.parse(response.body);
        expect(resultData).toEqual(inputData2);

      });

    });

  });

  describe('canHandle()', () => {

    it('can always handle a request', async () => {

      const canHandle = await jsonStoreHandler.canHandle(requestContext).toPromise();
      expect(canHandle).toEqual(true);

    });

  });

});
