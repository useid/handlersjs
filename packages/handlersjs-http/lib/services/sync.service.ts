import { KeyValueStore } from '@digita-ai/handlersjs-core';
import fetch from 'node-fetch';

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

      const options = this.latest_sync ? {
        headers: { 'If-Modified-Since': '' },
      } : undefined;

      fetch(host, options)
        .then((res) => res.json())
        .then((res) => {

          const fetchedStorages: T[] = res;
          fetchedStorages.forEach((val) => storage.add(val));

        });

    });

    this.latest_sync = new Date();

    return this;

  }

}
