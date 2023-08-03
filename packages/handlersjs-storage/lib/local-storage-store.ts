import { TypedKeyValueStore } from './models/typed-key-value-store';

/**
 * A {@link TypedKeyValueStore} which uses a JavaScript Map for internal storage.
 *
 * @inheritdoc
 */
export class LocalStorageStore<M> implements TypedKeyValueStore<M> {

  constructor() {

    if (!localStorage.getItem('localStorageStore')) localStorage.setItem('localStorageStore', JSON.stringify({}));

  }

  async get<T extends keyof M>(key: T): Promise<M[T] | undefined> {

    const localStorageStoreString = localStorage.getItem('localStorageStore');

    const localStorageStore = localStorageStoreString
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ? JSON.parse(localStorageStoreString) as Record<T, unknown>
      : undefined;

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Promise.resolve(localStorageStore ? localStorageStore[key] as M[T] : undefined);

  }

  async has<T extends keyof M>(key: T): Promise<boolean> {

    const localStorageStoreString = localStorage.getItem('localStorageStore');

    const localStorageStore = localStorageStoreString
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ? JSON.parse(localStorageStoreString) as Record<T, unknown>
      : undefined;

    return Promise.resolve(localStorageStore
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? localStorageStore[key] !== undefined
      : false);

  }

  async set<T extends keyof M>(key: T, value: M[T]): Promise<this> {

    const localStorageStoreString = localStorage.getItem('localStorageStore');

    const localStorageStore = localStorageStoreString
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ? JSON.parse(localStorageStoreString) as Record<T, unknown>
      : undefined;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    localStorageStore![key] = value;

    localStorage.setItem('localStorageStore', JSON.stringify(localStorageStore));

    return Promise.resolve(this);

  }

  async delete<T extends keyof M>(key: T): Promise<boolean> {

    const localStorageStoreString = localStorage.getItem('localStorageStore');

    const localStorageStore = localStorageStoreString
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ? JSON.parse(localStorageStoreString) as Record<T, unknown>
      : undefined;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    localStorageStore![key] = undefined;

    localStorage.setItem('localStorageStore', JSON.stringify(localStorageStore));

    return Promise.resolve(this.has(key));

  }

  // eslint-disable-next-line require-yield
  entries(): AsyncIterableIterator<[keyof M, M[keyof M]]> {

    throw new Error('Not Implemented');

  }

}
