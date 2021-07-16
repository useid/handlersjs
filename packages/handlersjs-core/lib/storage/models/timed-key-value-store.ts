import { KeyValueStore } from './key-value-store';

export interface TimedKeyValueStore<K, V> extends KeyValueStore<K, V> {

  latestUpdate: (key: K) => Promise<number | undefined>;

  hasUpdate: (key: K, time: number) => Promise<boolean | undefined>;

}
