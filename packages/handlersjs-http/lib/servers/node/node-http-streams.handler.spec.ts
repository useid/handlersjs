import { of } from 'rxjs';
import { NodeHttpStreamsHandler } from './node-http-streams.handler';

class HandlerWrapper extends NodeHttpStreamsHandler {

  handle() { return of(); }

}

describe('NodeHttpStreamsHandler', () => {

  it('should instantiate', () => {

    expect(new HandlerWrapper()).toBeDefined();

  });

});
