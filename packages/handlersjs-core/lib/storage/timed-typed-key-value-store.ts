import { TimedKeyValueStore } from './timed-key-value-store';
import { TypedKeyValueStore } from './typed-key-value-store';

export type TimedTypedKeyValueStore<M> = TypedKeyValueStore<M> & TimedKeyValueStore<keyof M, M[keyof M]>;
