
import { MemoryStore } from './memory-store';

describe('MemoryStore', () => {

  interface TestInterface {
    key1: number;
    key2: string;
    key3: boolean;
    key4: string[];
  }

  let memoryStore: MemoryStore<TestInterface>;

  beforeEach(() => {

    memoryStore = new MemoryStore();

  });

  it('can be initialized with values', async () => {

    const initialData: [keyof TestInterface, TestInterface[keyof TestInterface]][] = [
      [ 'key1', 4 ],
      [ 'key2', '123' ],
      [ 'key4', [ '', '', '321' ] ],
    ];

    memoryStore = new MemoryStore(initialData);

    await expect(memoryStore.get('key1')).resolves.toEqual(4);
    await expect(memoryStore.get('key2')).resolves.toEqual('123');
    await expect(memoryStore.get('key4')).resolves.toEqual([ '', '', '321' ]);

  });

  it('can be initialized without values', async () => {

    memoryStore = new MemoryStore();

    await expect(memoryStore.has('key1')).resolves.toEqual(false);

  });

  describe('get()', () => {

    it('should get a value that has been set', async () => {

      await memoryStore.set('key1', 5);
      await memoryStore.set('key2', 'test');

      await expect(memoryStore.get('key1')).resolves.toEqual(5);
      await expect(memoryStore.get('key2')).resolves.toEqual('test');

    });

    it('can not get a value that has not been set', async () => {

      await expect(memoryStore.get('key1')).resolves.toBeUndefined();

    });

  });

  describe('set()', () => {

    it('can set a key', async () => {

      await memoryStore.set('key1', 5);
      await expect(memoryStore.get('key1')).resolves.toEqual(5);

    });

    it('can overwrite an existing key', async () => {

      await memoryStore.set('key1', 5);
      await memoryStore.set('key1', 8);
      await expect(memoryStore.get('key1')).resolves.toEqual(8);

    });

  });

  describe('has()', () => {

    it('should not have keys that were not added', async () => {

      await expect(memoryStore.has('key1')).resolves.toBe(false);
      // implies ->
      await expect(memoryStore.get('key1')).resolves.toBeUndefined();
      await expect(memoryStore.latestUpdate('key1')).resolves.toBeUndefined();
      await expect(memoryStore.hasUpdate('key1', Date.now())).resolves.toBeUndefined();

    });

    it('should have keys that were added', async () => {

      await memoryStore.set('key1', 5);
      await expect(memoryStore.has('key1')).resolves.toBe(true);
      // implies ->
      await expect(memoryStore.get('key1')).resolves.toBeDefined();
      await expect(memoryStore.latestUpdate('key1')).resolves.toBeDefined();
      await expect(memoryStore.hasUpdate('key1', Date.now())).resolves.toBeDefined();

    });

  });

  describe('delete()', () => {

    it('should not contain a deleted key', async () => {

      await memoryStore.set('key2', 'test');
      await expect(memoryStore.get('key2')).resolves.toEqual('test');
      await expect(memoryStore.delete('key2')).resolves.toBe(true);

      await expect(memoryStore.has('key2')).resolves.toBe(false);
      await expect(memoryStore.get('key2')).resolves.toBeUndefined();

    });

    it('can add an item again after deletion', async () => {

      await memoryStore.set('key2', 'test');
      await expect(memoryStore.get('key2')).resolves.toEqual('test');
      await expect(memoryStore.delete('key2')).resolves.toBe(true);

      await memoryStore.set('key2', 'test2');

      await expect(memoryStore.has('key2')).resolves.toBe(true);
      await expect(memoryStore.get('key2')).resolves.toEqual('test2');

    });

    it('can not delete a value twice', async () => {

      await memoryStore.set('key2', 'test');
      await expect(memoryStore.delete('key2')).resolves.toBe(true);
      await expect(memoryStore.delete('key2')).resolves.toBe(false);

    });

  });

  describe('entries()', () => {

    it('should not iterate over keys pairs when it is empty', async () => {

      memoryStore.entries().next().then((result) => {

        expect(result.done).toBe(true);

      });

    });

    it('should iterate over added key-value pairs', async () => {

      const allValues: [keyof TestInterface, TestInterface[keyof TestInterface]][] = [
        [ 'key1', 4 ],
        [ 'key2', '123' ],
        [ 'key4', [ '', '', '321' ] ],
      ];

      const allValuesMap: Map<keyof TestInterface, TestInterface[keyof TestInterface]> = new Map(allValues);

      allValuesMap.forEach((value, key) => memoryStore.set(key, value));

      for await (const [ key, value ] of memoryStore.entries()) {

        expect(value).toEqual(allValuesMap.get(key));
        allValuesMap.delete(key);

      }

      expect(allValuesMap.size).toBe(0);

    });

  });

  describe('latestUpdate()', () => {

    it('should know when the item was updated', async () => {

      const beforeSetTime = Date.now() - 1;
      await memoryStore.set('key1', 8);
      const setTime = await memoryStore.latestUpdate('key1');
      const afterSetTime = Date.now() + 1;

      expect(beforeSetTime < setTime && setTime < afterSetTime).toBe(true);

    });

  });

  describe('hasUpdate()', () => {

    it('should tell you if there was an update', async () => {

      const beforeSetTime = Date.now() - 1;
      await memoryStore.set('key1', 8);
      const afterSetTime = Date.now() + 1;

      await expect(memoryStore.hasUpdate('key1', beforeSetTime)).resolves.toBe(true);
      await expect(memoryStore.hasUpdate('key1', afterSetTime)).resolves.toBe(false);

    });

  });

});
