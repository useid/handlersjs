import { KeyValueStore } from './key-value-store';

export interface TypedKeyValueStore<M> extends KeyValueStore<keyof M, M[keyof M]> {

  /**
   * Returns the value stored for the given identifier.
   * `undefined` if no value is stored.
   *
   * @param identifier - Identifier to get the value for.
   */
  get: <T extends keyof M>(key: T) => Promise<M[T] | undefined>;

  /**
   * Checks if there is a value stored for the given key.
   *
   * @param identifier - Identifier to check.
   */
  has: <T extends keyof M>(key: T) => Promise<boolean>;

  /**
   * Sets the value for the given key.
   *
   * @param key - Key to set/update.
   * @param value - Value to store.
   *
   * @returns The storage.
   */
  set: <T extends keyof M>(key: T, value: M[T]) => Promise<this>;

  /**
   * Deletes the value stored for the given key.
   *
   * @param key - Key to delete.
   *
   * @returns If there was a value to delete.
   */
  delete: <T extends keyof M>(key: T) => Promise<boolean>;

  /**
   * An iterable of entries in the storage.
   */
  entries: () => AsyncIterableIterator<[keyof M, M[keyof M]]>;

}
