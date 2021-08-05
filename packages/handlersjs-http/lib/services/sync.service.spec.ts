import { MemoryStore } from '@digita-ai/handlersjs-core';
import fetch from 'node-fetch';
import { advanceBy as advanceDateBy, clear as clearDateMock } from 'jest-date-mock';
import { SyncService } from './sync.service';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

describe('SyncService', () => {

  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: '*/*',
  });

  const peers = [ 'peer1.com', 'peer2.com' ];

  type M = {
    storage: number[]; } & {
    peers: string[];
    [key: string]: any;
  };

  let store: MemoryStore<M>;
  let syncService: SyncService<number, 'storage', 'peers', M>;
  let fetchMock: jest.MockedFunction<typeof fetch>;
  interface peerResponseMock {
    peer: string;
    httpStatus: number;
    storages?: number[];
  }

  // mocks the fetch() function with http responses according to the peerResponseMock interface
  const mockWithStorages = (... responseMocks: peerResponseMock[]) => {

    fetchMock.mockImplementation(async (url, options) => {

      for (const mockInfo of responseMocks) {

        if (mockInfo.peer === url) {

          return new Response(JSON.stringify(mockInfo.storages ? mockInfo.storages : []),
            { status: mockInfo.httpStatus, headers });

        }

      }

      return new Response('[]', { status: 200, headers });

    });

  };

  beforeEach(() => {

    clearDateMock();
    jest.resetAllMocks();

    fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

    fetchMock.mockImplementation(async (url, options) => new Response('[]', { status: 200, headers }));

    store = new MemoryStore<M>([
      [ 'storage', [] ],
      [ 'peers', peers ],
      [ 'other', 'something else' ],
    ]);

    syncService = new SyncService<number, 'storage', 'peers', M>('storage', 'peers', store);

  });

  const expectStorageEquals = async (expectedStorage: number[]) => {

    const contents: number[] = await store.get('storage');
    expect(contents.sort()).toEqual(contents.sort());

  };

  const latestModifiedSinceHeader = () => {

    const calls = fetchMock.mock.calls;

    return calls.length === 0 ? undefined : calls[calls.length - 1][1]?.headers['If-Modified-Since'];

  };

  describe('handle()', () => {

    it('resolves when there are no peers', async () => {

      await store.set('peers', []);
      await expect(syncService.handle().toPromise()).resolves.toBeUndefined();

    });

    it('resolves when peers are undefined', async () => {

      await store.delete('peers');
      await expect(syncService.handle().toPromise()).resolves.toBeUndefined();

    });

    it('sends a request to all peers in the store', async () => {

      await syncService.handle().toPromise();
      fetchMock.mock.calls.forEach((call) => expect(peers.indexOf(call[0].toString())).not.toBe(-1));

    });

    describe('If-Modified-Since behavior', () => {

      it('has the If-Modified-Since header from the second request and onwards', async () => {

        await syncService.handle().toPromise();
        expect(latestModifiedSinceHeader()).toBeUndefined();
        await syncService.handle().toPromise();
        expect(latestModifiedSinceHeader()).toBeDefined();
        await syncService.handle().toPromise();
        expect(latestModifiedSinceHeader()).toBeDefined();

      });

      it('has the correct modifiedSince header', async () => {

        const beforeFirstSync = Math.floor(Date.now() / 1000); // If-Modified-Since header value rounds down to the second
        await syncService.handle().toPromise();
        const afterFirstSync = Math.floor(Date.now() / 1000);

        await syncService.handle().toPromise();
        const firstSync = new Date(latestModifiedSinceHeader()).getTime() / 1000;

        expect(beforeFirstSync <= firstSync && firstSync <= afterFirstSync).toBe(true);

      });

      it('updates the If-Modified-Since header correctly', async () => {

        await syncService.handle().toPromise();
        await syncService.handle().toPromise();
        const firstSync = new Date(latestModifiedSinceHeader()).getTime();

        const nextSync = firstSync + 10000;
        advanceDateBy(10000);

        await syncService.handle().toPromise();
        await syncService.handle().toPromise();
        const secondSync = new Date(latestModifiedSinceHeader()).getTime();

        expect(secondSync > nextSync - 1000 && secondSync < nextSync + 1000).toBe(true);

      });

    });

    describe('Storage behavior', () => {

      it("doesn't update store if everything is up to date", async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

        mockWithStorages(
          { peer: 'peer2.com', httpStatus: 304 },
          { peer: 'peer2.com', httpStatus: 304 },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

      });

      it('updates store correctly if one host has updated values', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3 ]);

        mockWithStorages(
          { peer: 'peer2.com', httpStatus: 200, storages: [ 13, 14, 15 ] },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3, 13, 14, 15 ]);

      });

      it('updates store correctly if more than one hosts have updated values', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await syncService.handle().toPromise();

        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

      });

      it('updates correctly if multiple updates happen sequentially', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

        mockWithStorages(
          { peer: 'peer2.com', httpStatus: 200, storages: [ 13, 14, 15 ] },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3, 4, 5, 13, 14, 15 ]);

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 11, 12, 13 ] },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3, 4, 5, 11, 12, 13, 14, 15 ]);

      });

      it('updates correctly when a host joins', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await syncService.handle().toPromise();

        mockWithStorages(
          { peer: 'peer3.com', httpStatus: 200, storages: [ 50, 51, 52 ] }
        );

        const peersList = await store.get('peers');
        peersList.push('peer3.com');
        await store.set('peers', peersList);

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3, 4, 5, 50, 51, 52 ]);

      });

      it('only updates the store if httpStatus is 200', async () => {

        const peersList = await store.get('peers');
        peersList.push('peer3.com');
        await store.set('peers', peersList);

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 304, storages: [ 4, 5, 6 ] },
          { peer: 'peer3.com', httpStatus: 400, storages: [ 7, 8, 9 ] },
        );

        await syncService.handle().toPromise();
        expectStorageEquals([ 1, 2, 3 ]);

      });

    });

    describe('endpoint behavior', () => {

      it('can fetch resources from peers with a suffix', async () => {

        syncService = new SyncService<number, 'storage', 'peers', M>('storage', 'peers', store, 'endpoint');

        mockWithStorages(
          { peer: 'peer1.com/endpoint', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com/endpoint', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await syncService.handle().toPromise();

        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

      });

      it('doesn\t fetch from peers with wrong or unexistent suffix', async () => {

        syncService = new SyncService<number, 'storage', 'peers', M>('storage', 'peers', store, 'endpoint');

        mockWithStorages(
          { peer: 'peer1.com/endpoint/endpoint2', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer1.com/endpoint2/endpoint', httpStatus: 200, storages: [ 1, 4, 5 ] },
          { peer: 'peer1.com', httpStatus: 200, storages: [ 5, 6, 7 ] },
          { peer: 'peer2.com/endpoint', httpStatus: 200, storages: [ 7, 8, 9 ] },
          { peer: 'peer2.com/endpoint2', httpStatus: 200, storages: [ 8, 9, 10 ] },
        );

        await syncService.handle().toPromise();

        expectStorageEquals([ 7, 8, 9 ]);

      });

    });

  });

  describe('canHandle()', () => {

    it('should return true', async () => {

      await expect(syncService.canHandle().toPromise()).resolves.toBe(true);

    });

  });

});
