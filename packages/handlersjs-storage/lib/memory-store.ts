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

import clone from 'clone';
import { TimedValue } from './models/timed-key-value-store';
import { TimedTypedKeyValueStore } from './models/timed-typed-key-value-store';

/**
 * A {@link KeyValueStore} which uses a JavaScript Map for internal storage.
 *
 * @inheritdoc
 */
export class MemoryStore<M> implements TimedTypedKeyValueStore<M> {

  private readonly data: Map<keyof M, TimedValue<M[keyof M]>>;

  /**
   *
   * @param initialData data to initialize the memorystore with @range {json}
   */
  constructor(initialData?: [keyof M, M[keyof M]][]) {

    this.data = new Map(initialData?.map(([ key, value ]) => [ key, { value: clone(value), timestamp: Date.now() } ]));

  }

  get<T extends keyof M>(key: T): Promise<M[T] | undefined> {

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Promise.resolve(this.data.has(key) ? clone(this.data.get(key)?.value as M[T]) : undefined);

  }

  has<T extends keyof M>(key: T): Promise<boolean> {

    return Promise.resolve(this.data.has(key));

  }

  set<T extends keyof M>(key: T, value: M[T]): Promise<this> {

    this.data.set(key, { value: clone(value), timestamp: Date.now() });

    return Promise.resolve(this);

  }

  delete<T extends keyof M>(key: T): Promise<boolean> {

    return Promise.resolve(this.data.delete(key));

  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async* entries(): AsyncIterableIterator<[keyof M, M[keyof M]]> {

    for (const [ key, value ] of this.data.entries()) {

      yield [ key, clone(value.value) ];

    }

  }

  latestUpdate<T extends keyof M>(key: T): Promise<number | undefined> {

    return Promise.resolve(this.data.get(key)?.timestamp);

  }

  hasUpdate <T extends keyof M>(key: T, time: number): Promise<boolean | undefined> {

    const timedValue = this.data.get(key);

    return Promise.resolve(timedValue ? timedValue.timestamp > time : undefined);

  }

}
