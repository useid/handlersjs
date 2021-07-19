import http from 'http';
import { KeyValueStore } from '@digita-ai/handlersjs-core';

export class SyncService<T> {

  latest_sync: Date | undefined = undefined;

  constructor(
    private readonly storage: string,
    private readonly peers: string,
    private readonly storageStore: KeyValueStore<string, Set<T>>,
    private readonly peersStore: KeyValueStore<string, Set<string>>,
  ) {

  }

  async sync(): Promise<SyncService<T>> {

    const peers = await this.peersStore.get(this.peers);
    const storage = await this.storageStore.get(this.storage);

    if (!peers || !storage) {

      throw new Error('Invalid storage identifiers');

    }

    peers.forEach((host) => {

      http.get(
        {
          host,
          headers: {
            'If-Modified-Since': this.latest_sync?.toUTCString(),
          },
        }, (result) => {

          const data: Buffer[] = [];
          result.on('data', (chunk) => data.push(chunk));

          result.on('end', () => {

            const buffer = Buffer.concat(data);
            const fetchedStorages: T[] = JSON.parse(buffer.toString());
            fetchedStorages.forEach((val) => storage.add(val));

          });

        }
      ).on('error', (err) => {

        // todo remove from storages?
        throw err;

      });

    });

    this.latest_sync = new Date();

    return this;

  }

}
