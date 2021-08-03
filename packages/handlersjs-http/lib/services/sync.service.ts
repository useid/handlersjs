import { Handler, TimedTypedKeyValueStore } from '@digita-ai/handlersjs-core';
import fetch from 'node-fetch';
import { from, Observable, of } from 'rxjs';

export class SyncService<T, S extends string, P extends string, M extends {
  [s in S]: Set<T> } & { [p in P]: Set<string> }> extends Handler<void, void> {

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
  ) { super(); }

  /**
   * Synchronizes the storage value of the store with other peers in the network
   *
   * @returns itself
   */
  private async sync(): Promise<void> {

    const storage: Set<T> | undefined = await this.store.get(this.storage);
    const peers: Set<string> | undefined = await this.store.get(this.peers);

    const options = this.latestSync ? {
      headers: { 'If-Modified-Since': this.latestSync.toUTCString() },
    } : undefined;

    this.latestSync = new Date();

    const fetchedValues: T[][] = await Promise.all((peers ? [ ... peers ] : []).map(async (host) => {

      const httpResponse = await fetch(host, options);

      return httpResponse.status === 200 ? await httpResponse.json() : [];

    }));

    await this.store.set(this.storage, new Set([ ...storage ?? [], ...fetchedValues.flat() ]) as M[S]);

  }

  canHandle(input: void, intermediateOutput?: never): Observable<boolean> {

    return of(true);

  }

  handle(input: void, intermediateOutput?: never): Observable<void> {

    return from(this.sync());

  }

}
