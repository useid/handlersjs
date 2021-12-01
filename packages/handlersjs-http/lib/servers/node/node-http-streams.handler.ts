import { Handler } from '@digita-ai/handlersjs-core';
import { NodeHttpStreams } from './node-http-streams.model';

/**
 * Handles the IncomingMessage and ServerResponse of a { NodeHttpStreams } object.
 */
export abstract class NodeHttpStreamsHandler extends Handler<NodeHttpStreams> { }
