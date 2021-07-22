import { MemoryStore } from '@digita-ai/handlersjs-core';
import fetch from 'node-fetch';

type StorageKeys = 'storage' | 'Storage' | 'store' | 'Store';
type PeersKeys = 'peers' | 'Peers' | 'hosts' | 'Hosts';

export class SyncService<T, M> {

  latestSync: Date | undefined = undefined;

  constructor(
    private readonly storage: StorageKeys & keyof M,
    private readonly peers: PeersKeys & keyof M,
    private readonly store: MemoryStore<
    { [storageKey in (StorageKeys & keyof M)]: Set<T>; } &
    { [peersKey in (PeersKeys & keyof M)]: Set<string>; } &
    M
    >,
  ) {

  }

  async sync(): Promise<this> {

    const storage: Set<T> | undefined = await this.store.get(this.storage);
    const peers: Set<string> | undefined = await this.store.get(this.peers);

    const modifiedSince = this.latestSync;
    this.latestSync = new Date();

    const options = modifiedSince ? {
      headers: { 'If-Modified-Since': modifiedSince.toUTCString() },
    } : undefined;

    await Promise.all((peers ? [ ... peers ]: []).map(async (host) => {

      const httpResponse = await fetch(host, options);

      if (httpResponse.status === 200) {

        const fetchedStorages: T[] = await httpResponse.json();
        fetchedStorages.forEach((val) => storage?.add(val));

      }

    }));

    this.latestSync = new Date();

    return this;

  }

}
