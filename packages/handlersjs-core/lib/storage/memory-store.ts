/**
 * MIT License
 *
 * Copyright (c) 2020 Solid Community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TimedTypedKeyValueStore } from './timed-typed-key-value-store';

interface TimedValue<V> {
  value: V;
  timestamp: number;
}

interface KeyValPair<M> {
  key: keyof M;
  timestamp: M[keyof M];
}

/**
 * A {@link KeyValueStore} which uses a JavaScript Map for internal storage.
 * Warning: Uses a Map object, which internally uses `Object.is` for key equality,
 * so object keys have to be the same objects.
 */
export class MemoryStore<M> implements TimedTypedKeyValueStore<M> {

  private readonly data: Map<keyof M, TimedValue<M[keyof M]>>;

  constructor(initialData?: [keyof M, M[keyof M]][]) {

    this.data = new Map(initialData?.map(([ key, value ]) => [ key, { value, timestamp: Date.now() } ]));

  }

  async get<T extends keyof M>(key: T): Promise<M[T] | undefined> {

    return this.data.has(key) ? this.data.get(key)?.value as M[T] : undefined;

  }

  async has<T extends keyof M>(key: T): Promise<boolean> {

    return this.data.has(key);

  }

  async set<T extends keyof M>(key: T, value: M[T]): Promise<this> {

    this.data.set(key, { value, timestamp: Date.now() });

    return this;

  }

  async delete<T extends keyof M>(key: T): Promise<boolean> {

    return this.data.delete(key);

  }

  async* entries(): AsyncIterableIterator<[keyof M, M[keyof M]]> {

    for (const [ key, value ] of this.data.entries()) {

      yield [ key, value.value ];

    }

  }

  async latestUpdate<T extends keyof M>(key: T): Promise<number | undefined> {

    return this.data.get(key)?.timestamp;

  }

  async hasUpdate <T extends keyof M>(key: T, time: number): Promise<boolean | undefined> {

    const timedValue = this.data.get(key);

    return timedValue !== undefined ? timedValue.timestamp < time : undefined;

  }

}
