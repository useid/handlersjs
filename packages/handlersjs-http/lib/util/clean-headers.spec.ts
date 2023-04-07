import { cleanHeaders } from './clean-headers';

describe('cleanHeaders()', () => {

  it('should return an empty object when given an empty object', () => {

    expect(cleanHeaders({})).toEqual({});

  });

  it('should make all keys lowercase', () => {

    expect(cleanHeaders({ 'X-Test': 'test' })).toEqual({ 'x-test': 'test' });

  });

  it('should combine multiple headers with the same key', () => {

    expect(cleanHeaders({ 'X-Test': 'test', 'x-test': 'test2' })).toEqual({ 'x-test': 'test,test2' });

  });

});
