/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jest/expect-expect */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MemoryStore, TimedTypedKeyValueStore } from '@useid/handlersjs-storage';
import fetch from 'node-fetch';
import { advanceBy as advanceDateBy, clear as clearDateMock } from 'jest-date-mock';
import { lastValueFrom } from 'rxjs';
import { SyncService } from './sync.service';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

describe('SyncService', () => {

  const headers = {
    'Content-Type': 'application/json',
    Accept: '*/*',
  };

  const peers = [ 'peer1.com', 'peer2.com' ];

  type M = {
    storage: number[];
  } & {
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

      if (responseMocks.length === 0) {

        return new Response(new TypeError('fetch failed'));

      }

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

    store = new MemoryStore<M>([
      [ 'storage', [] ],
      [ 'peers', peers ],
      [ 'other', 'something else' ],
    ]);

    fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

    syncService = new SyncService<number, 'storage', 'peers', M>('storage', 'peers', store);

  });

  const expectStorageEquals = async (expectedStorage: number[]) => {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const contents: number[] = (await store.get('storage') as number[]);

    expect(contents.sort()).toEqual(contents.sort());

  };

  const latestModifiedSinceHeader = () => {

    const calls = fetchMock.mock.calls;

    if (calls.length !== 0 && calls[calls.length - 1][1] && calls[calls.length - 1][1]?.headers) {

      const h = calls[calls.length - 1][1]?.headers;

      if (h) return h['If-Modified-Since'];

      return undefined;

    }

    return undefined;

  };

  it('should be correctly instantiated', async () => {

    expect(syncService).toBeTruthy();

  });

  it('should error when no storage was provided', async () => {

    expect(() => new SyncService<number, 'storage', 'peers', M>((undefined as unknown as 'storage'), 'peers', store)).toThrow('A storage must be provided');

  });

  it('should error when no peers were provided', async () => {

    expect(() => new SyncService<number, 'storage', 'peers', M>('storage', (undefined as unknown as 'peers'), store)).toThrow('Peers must be provided');

  });

  it('should error when no store was provided', async () => {

    expect(() => new SyncService<number, 'storage', 'peers', M>('storage', 'peers', (undefined as unknown as TimedTypedKeyValueStore<M>))).toThrow('A store must be provided');

  });

  describe('handle()', () => {

    it('resolves when there are no peers', async () => {

      await store.set('peers', []);

      await expect(lastValueFrom(syncService.handle())).resolves.toBeUndefined();

    });

    it('resolves when peers are undefined', async () => {

      await store.delete('peers');

      await expect(lastValueFrom(syncService.handle())).resolves.toBeUndefined();

    });

    it('sends a request to all peers in the store', async () => {

      await lastValueFrom(syncService.handle());
      fetchMock.mock.calls.forEach((call) => expect(peers.indexOf(call[0].toString())).not.toBe(-1));

    });

    describe('If-Modified-Since behavior', () => {

      it('has the If-Modified-Since header from the second request and onwards', async () => {

        await lastValueFrom(syncService.handle());

        expect(latestModifiedSinceHeader()).toBeUndefined();

        await lastValueFrom(syncService.handle());

        expect(latestModifiedSinceHeader()).toBeDefined();

        await lastValueFrom(syncService.handle());

        expect(latestModifiedSinceHeader()).toBeDefined();

      });

      it('has the correct modifiedSince header', async () => {

        const beforeFirstSync = Math.floor(Date.now() / 1000); // If-Modified-Since header value rounds down to the second
        await lastValueFrom(syncService.handle());
        const afterFirstSync = Math.floor(Date.now() / 1000);

        await lastValueFrom(syncService.handle());
        const firstSync = new Date(latestModifiedSinceHeader()).getTime() / 1000;

        expect(beforeFirstSync <= firstSync && firstSync <= afterFirstSync).toBe(true);

      });

      it('updates the If-Modified-Since header correctly', async () => {

        await lastValueFrom(syncService.handle());
        await lastValueFrom(syncService.handle());
        const firstSync = new Date(latestModifiedSinceHeader()).getTime();

        const nextSync = firstSync + 10000;
        advanceDateBy(10000);

        await lastValueFrom(syncService.handle());
        await lastValueFrom(syncService.handle());
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

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

        mockWithStorages(
          { peer: 'peer2.com', httpStatus: 304 },
          { peer: 'peer2.com', httpStatus: 304 },
        );

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

      });

      it('updates store correctly if one host has updated values', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
        );

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3 ]);

        mockWithStorages(
          { peer: 'peer2.com', httpStatus: 200, storages: [ 13, 14, 15 ] },
        );

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3, 13, 14, 15 ]);

      });

      it('updates store correctly if more than one hosts have updated values', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await lastValueFrom(syncService.handle());

        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

      });

      it('updates correctly if multiple updates happen sequentially', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3, 4, 5 ]);

        mockWithStorages(
          { peer: 'peer2.com', httpStatus: 200, storages: [ 13, 14, 15 ] },
        );

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3, 4, 5, 13, 14, 15 ]);

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 11, 12, 13 ] },
        );

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3, 4, 5, 11, 12, 13, 14, 15 ]);

      });

      it('updates correctly when a host joins', async () => {

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await lastValueFrom(syncService.handle());

        mockWithStorages(
          { peer: 'peer3.com', httpStatus: 200, storages: [ 50, 51, 52 ] },
        );

        const peersList = await store.get('peers');
        peersList?.push('peer3.com');
        await store.set('peers', (peersList as unknown as string[]));

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3, 4, 5, 50, 51, 52 ]);

      });

      it('only updates the store if httpStatus is 200', async () => {

        const peersList = await store.get('peers');
        peersList?.push('peer3.com');
        await store.set('peers', (peersList as unknown as string[]));

        mockWithStorages(
          { peer: 'peer1.com', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com', httpStatus: 304, storages: [ 4, 5, 6 ] },
          { peer: 'peer3.com', httpStatus: 400, storages: [ 7, 8, 9 ] },
        );

        await lastValueFrom(syncService.handle());
        expectStorageEquals([ 1, 2, 3 ]);

      });

      it('should set with an empty array when storage was not found in the store', async () => {

        store.set = jest.fn();

        syncService = new SyncService<number, 'storage', 'peers', M>('storage', 'peers', store, 'endpoint');

        await store.delete('storage');

        mockWithStorages();

        await lastValueFrom(syncService.handle());

        expect(store.set).toHaveBeenCalledTimes(1);
        expect(store.set).toHaveBeenCalledWith('storage', []);

      });

      it('should not include any data from peers to which requests fail', async () => {

        fetchMock.mockImplementation(() => { throw new Error('fetch failed'); });

        await store.set('peers', [ 'this_is_not_a_valid_peer' ]);
        store.set = jest.fn();

        await lastValueFrom(syncService.handle());

        expect(store.set).toHaveBeenCalledTimes(1);
        expect(store.set).toHaveBeenCalledWith('storage', []);

      });

    });

    describe('endpoint behavior', () => {

      it('can fetch resources from peers with a suffix', async () => {

        syncService = new SyncService<number, 'storage', 'peers', M>('storage', 'peers', store, 'endpoint');

        mockWithStorages(
          { peer: 'peer1.com/endpoint', httpStatus: 200, storages: [ 1, 2, 3 ] },
          { peer: 'peer2.com/endpoint', httpStatus: 200, storages: [ 1, 4, 5 ] },
        );

        await lastValueFrom(syncService.handle());

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

        await lastValueFrom(syncService.handle());

        expectStorageEquals([ 7, 8, 9 ]);

      });

    });

  });

});
