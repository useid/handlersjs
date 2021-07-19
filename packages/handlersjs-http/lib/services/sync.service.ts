import { KeyValueStore } from '@digita-ai/handlersjs-core';
import fetch from 'node-fetch';

export class SyncService<T> {

  latestSync: Date | undefined = undefined;

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

    const modifiedCompare = this.latestSync;
    this.latestSync = new Date();

    peers.forEach((host) => {

      const options = modifiedCompare ? {
        headers: { 'If-Modified-Since': modifiedCompare.toUTCString() },
      } : undefined;

      fetch(host, options)
        .then((res) => res.status === 200 ? res.json() : Promise.reject())
        .then((res) => {

          const fetchedStorages: T[] = res;
          fetchedStorages.forEach((val) => storage.add(val));

        });

    });

    this.latestSync = new Date();

    return this;

  }

}
