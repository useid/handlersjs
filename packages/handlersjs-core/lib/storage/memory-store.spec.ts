
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

    expect(await memoryStore.get('key1')).toEqual(4);
    expect(await memoryStore.get('key2')).toEqual('123');
    expect(await memoryStore.get('key4')).toEqual([ '', '', '321' ]);

  });

  it('can be initialized without values', async () => {

    memoryStore = new MemoryStore();

    expect(await memoryStore.has('key1')).toEqual(false);

  });

  describe('get()', () => {

    it('should get a value that has been set', async () => {

      await memoryStore.set('key1', 5);
      await memoryStore.set('key2', 'test');

      expect(await memoryStore.get('key1')).toEqual(5);
      expect(await memoryStore.get('key2')).toEqual('test');

    });

  });

  describe('set()', () => {

    it('can overwrite an existing key', async () => {

      await memoryStore.set('key1', 5);
      await memoryStore.set('key1', 8);
      expect(await memoryStore.get('key1')).toEqual(8);

    });

  });

  describe('has()', () => {

    it('should not have keys that were not added', async () => {

      expect(await memoryStore.has('key1')).toBe(false);
      // implies ->
      expect(await memoryStore.get('key1')).toBeUndefined();
      expect(await memoryStore.latestUpdate('key1')).toBeUndefined();
      expect(await memoryStore.hasUpdate('key1', Date.now())).toBeUndefined();

    });

  });

  describe('delete()', () => {

    it('should not contain a deleted key', async () => {

      await memoryStore.set('key2', 'test');

      await memoryStore.delete('key2');

      expect(await memoryStore.has('key2')).toBe(false);
      expect(await memoryStore.get('key2')).toBeUndefined();

    });

    it('can add an item again after deletion', async () => {

      await memoryStore.set('key2', 'test');

      await memoryStore.delete('key2');

      await memoryStore.set('key2', 'test2');

      expect(await memoryStore.has('key2')).toBe(true);
      expect(await memoryStore.get('key2')).toEqual('test2');

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

  describe('latestUpdate() & hasUpdate()', () => {

    it('should know when the item was updated', async () => {

      const beforeSetTime = Date.now() - 1;
      await memoryStore.set('key1', 8);
      const setTime = await memoryStore.latestUpdate('key1');
      const afterSetTime = Date.now() + 1;

      expect(beforeSetTime < setTime && setTime < afterSetTime).toBe(true);
      expect(await memoryStore.hasUpdate('key1', beforeSetTime)).toBe(true);
      expect(await memoryStore.hasUpdate('key1', afterSetTime)).toBe(false);

    });

  });

});
