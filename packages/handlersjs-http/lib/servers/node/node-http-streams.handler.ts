import { Handler } from '@useid/handlersjs-core';
import { NodeHttpStreams } from './node-http-streams.model';

/**
 * A {Handler} that handles the IncomingMessage and ServerResponse of a {NodeHttpStreams} object.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export abstract class NodeHttpStreamsHandler extends Handler<NodeHttpStreams> { }
