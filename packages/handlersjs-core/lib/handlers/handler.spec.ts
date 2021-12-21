import { of, lastValueFrom, Observable } from 'rxjs';
import { Handler } from './handler';

describe('Handler', () => {

  const MockHandler = class extends Handler { handle(): Observable<void> { return of(void 0); } };

  const handler = new MockHandler();

  it('should be correctly instantiated', () => expect(handler).toBeTruthy());

  describe('canHandle', () => {

    it('should return true', async () => expect(lastValueFrom(handler.canHandle())).resolves.toEqual(true));

  });

});
