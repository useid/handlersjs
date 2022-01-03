import { Handler } from '@digita-ai/handlersjs-core';
import { TimedTypedKeyValueStore } from '@digita-ai/handlersjs-storage';
import fetch from 'node-fetch';
import { from, Observable, of } from 'rxjs';

export class SyncService<T, S extends string, P extends string, M extends {
  [s in S]: T[] } & { [p in P]: string[] }> extends Handler<void, void> {

  latestSync: Date | undefined = undefined;

  /**
   *
   * @param storage key in which the storage is located
   * @param peers key in which the peers are located
   * @param store the given store, used by storage and peers
   * @param endpoint an optional endpoint suffix
   */
  constructor(
    private readonly storage: S,
    private readonly peers: P,
    private readonly store: TimedTypedKeyValueStore<M>,
    private readonly endpoint?: string
  ) {

    super();

    if (!storage) { throw new Error('A storage must be provided'); }

    if (!peers) { throw new Error('Peers must be provided'); }

    if (!store) { throw new Error('A store must be provided'); }

  }

  /**
   * Synchronizes the storage value of the store with other peers in the network
   *
   * @returns itself
   */
  private async sync(): Promise<void> {

    const storage: T[] = await this.store.get(this.storage) ?? [];

    const peers: string[] = await this.store.get(this.peers) ?? [];

    const options = this.latestSync ? {
      headers: { 'If-Modified-Since': this.latestSync.toUTCString() },
    } : undefined;

    this.latestSync = new Date();

    const fetchedValues: T[][] = await Promise.all(([ ... peers ]).map(async (host) => {

      try {

        const httpResponse = await fetch(`${host}${this.endpoint ? '/' + this.endpoint : ''}`, options);

        return httpResponse.status === 200 ? await httpResponse.json() : [];

      } catch (error) {

        return [];

      }

    }));

    await this.store.set(this.storage, [ ... new Set([ ...storage, ...fetchedValues.flat() ]) ] as M[S]);

  }

  handle(input: void): Observable<void> {

    return from(this.sync());

  }

}
