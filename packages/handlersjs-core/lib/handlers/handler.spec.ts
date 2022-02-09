import { of, Observable } from 'rxjs';
import { Handler } from './handler';

describe('Handler', () => {

  const MockHandler = class implements Handler { handle(): Observable<void> { return of(void 0); } };

  const handler = new MockHandler();

  it('should be correctly instantiated', () => expect(handler).toBeTruthy());

});
