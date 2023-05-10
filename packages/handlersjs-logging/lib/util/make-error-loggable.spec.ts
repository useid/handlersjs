import { makeErrorLoggable } from './make-error-loggable';

describe('makeErrorLoggable', () => {

  it('should return a set values when passed something that is not an Error', async () => {

    expect(makeErrorLoggable('foo')).toEqual({ 'error': 'not-an-error' });

  });

  it('should return a parsed object when passed an Error', async () => {

    const error = new Error('foo');

    expect(makeErrorLoggable(error)).toEqual({
      message: 'foo',
      name: 'Error',
      stack: expect.any(Array),
    });

  });

  it('should return an empty stack when passed an Error without a stack', async () => {

    const error = new Error('foo');
    delete error.stack;

    expect(makeErrorLoggable(error)).toEqual({
      message: 'foo',
      name: 'Error',
      stack: [],
    });

  });

});
