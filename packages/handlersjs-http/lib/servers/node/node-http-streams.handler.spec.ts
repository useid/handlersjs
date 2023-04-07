import { NodeHttpStreamsHandler } from './node-http-streams.handler';
import { of } from 'rxjs';

class HandlerWrapper extends NodeHttpStreamsHandler {

  handle() { return of(); }

}

describe('NodeHttpStreamsHandler', () => {

  it('should instantiate', () => {

    expect(new HandlerWrapper()).toBeDefined();

  });

});
