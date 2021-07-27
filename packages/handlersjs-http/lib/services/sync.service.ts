import { TimedTypedKeyValueStore } from '@digita-ai/handlersjs-core';
import fetch from 'node-fetch';

export class SyncService<T, S extends string, P extends string, M extends {
  [s in S]: Set<T> } & { [p in P]: Set<string> },
> {

  latestSync: Date | undefined = undefined;

  /**
   *
   * @param storage key in which the storage is located
   * @param peers key in which the peers are located
   * @param store the given store, used by storage and peers
   */
  constructor(
    private readonly storage: S,
    private readonly peers: P,
    private readonly store: TimedTypedKeyValueStore<M>,
  ) {

  }

  /**
   * Synchronizes the storage value of the store with other peers in the network
   *
   * @returns itself
   */
  async sync(): Promise<this> {

    const storage: Set<T> | undefined = await this.store.get(this.storage);
    const peers: Set<string> | undefined = await this.store.get(this.peers);

    const modifiedSince = this.latestSync;
    this.latestSync = new Date();

    const options = modifiedSince ? {
      headers: { 'If-Modified-Since': modifiedSince.toUTCString() },
    } : undefined;

    const fetchedValues: T[][] = await Promise.all((peers ? [ ... peers ] : []).map(async (host) => {

      const httpResponse = await fetch(host, options);

      return httpResponse.status === 200 ? await httpResponse.json() : [];

    }));

    fetchedValues
      .reduce((flat, toFlatten) => flat.concat(toFlatten), [])
      .forEach((val) => storage?.add(val));

    return this;

  }

}
