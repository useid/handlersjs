
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

  it('should not iterate over keys pairs when it is empty', async () => {

    const elements = [];
    for await(const entry of memoryStore.entries()) elements.push(entry);

    expect(elements.length).toBe(0);

  });

  it('should not have keys that were not added', async () => {

    expect(await memoryStore.has('key1')).toBeFalsy();
    expect(await memoryStore.get('key1')).toBeUndefined();
    expect(await memoryStore.latestUpdate('key1')).toBeUndefined();
    expect(await memoryStore.hasUpdate('key1', Date.now())).toBeUndefined();

  });

  it('should get a value that has been set', async () => {

    await memoryStore.set('key1', 5);

    expect(await memoryStore.get('key1')).toEqual(5);

    await memoryStore.set('key2', 'test');
    await memoryStore.set('key3', true);
    await memoryStore.set('key4', [ '123', '321' ]);

    expect(await memoryStore.get('key2')).toEqual('test');
    expect(await memoryStore.get('key3')).toEqual(true);
    expect(await memoryStore.get('key4')).toEqual([ '123', '321' ]);

  });

  it('should not contain a deleted key', async () => {

    await memoryStore.set('key2', 'test');

    await memoryStore.delete('key2');

    expect(await memoryStore.has('key2')).toBeFalsy();
    expect(await memoryStore.get('key2')).toBeUndefined();

  });

  it('should iterate over added key-value pairs', async () => {

    const keyValuePairs: TestInterface = {
      key1: 1,
      key2: 'fdg',
      key3: false,
      key4: [],
    };

    await memoryStore.set('key1', keyValuePairs.key1);
    await memoryStore.set('key3', keyValuePairs.key3);
    await memoryStore.set('key4', keyValuePairs.key4);

    let amount = 0;

    for await (const [ key, value ] of memoryStore.entries()) {

      amount++;
      expect(value).toEqual(keyValuePairs[key]);

    }

    expect(amount).toBe(3);

  });

  it('should know when the item was updated', async () => {

    const beforeSetTime = Date.now();
    await memoryStore.set('key1', 8);
    const setTime = await memoryStore.latestUpdate('key1');
    const afterSetTime = Date.now();

    expect(beforeSetTime <= setTime && setTime <= afterSetTime).toBe(true);
    expect(await memoryStore.hasUpdate('key1', beforeSetTime - 1)).toBe(false);
    expect(await memoryStore.hasUpdate('key1', afterSetTime + 1)).toBe(true);

  });

  it('can overwrite an existing key', async () => {

    await memoryStore.set('key1', 5);
    await memoryStore.set('key1', 8);
    expect(await memoryStore.get('key1')).toEqual(8);

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

});
