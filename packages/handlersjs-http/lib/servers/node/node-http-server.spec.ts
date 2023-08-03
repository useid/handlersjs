/* eslint-disable @typescript-eslint/unbound-method */
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { lastValueFrom, of } from 'rxjs';
import { HttpHandler } from '../../models/http-handler';
import { NodeHttpServer } from './node-http-server';
import { NodeHttpRequestResponseHandler } from './node-http-request-response.handler';
import { NodeHttpStreamsHandler } from './node-http-streams.handler';

describe('NodeHttpServer', () => {

  let server: NodeHttpServer;
  let handler: NodeHttpRequestResponseHandler;
  let nestedHttpHandler: HttpHandler;
  let host: string;
  let port: number;
  let req: IncomingMessage;
  let res: ServerResponse;

  beforeEach(() => {

    nestedHttpHandler = { handle: jest.fn() };

    handler = new NodeHttpRequestResponseHandler(nestedHttpHandler);
    handler.handle = jest.fn().mockReturnValueOnce(of());
    host = 'localhost';
    port = 8080;
    server = new NodeHttpServer(host, port, handler);
    req = new IncomingMessage(new Socket());
    req.url = 'www.digita.ai';
    req.method = 'GET';
    req.headers = {};
    res = new ServerResponse(req);

  });

  it('should be correctly instantiated if all correct arguments are provided', () => {

    expect(server).toBeTruthy();

  });

  it('should throw error when no host was provided', () => {

    expect(() => new NodeHttpServer((null as unknown as string), port, handler)).toThrow('A host must be provided');

  });

  it('should throw error when no port was provided', () => {

    expect(() => new NodeHttpServer(host, (null as unknown as number), handler)).toThrow('A port must be provided');

  });

  it('should throw error when no handler was provided', () => {

    expect(() => new NodeHttpServer(host, port, (null as unknown as NodeHttpStreamsHandler))).toThrow('A handler must be provided');

  });

  describe('start', () => {

    it('should return server if all goes well', async () => {

      await expect(lastValueFrom(server.start())).resolves.toEqual(server);

      await lastValueFrom(server.stop());

    });

    it('should return an error when something goes wrong', async () => {

      (server as any).server.listen = jest.fn().mockImplementationOnce(() => {

        (server as any).server.emit('error', 'test error');

      });

      await expect(lastValueFrom(server.start())).rejects.toThrow('The server ran into a problem:');

    });

  });

  describe('stop', () => {

    it('should return server if all goes well', async () => {

      await lastValueFrom(server.start());

      await expect(lastValueFrom(server.stop())).resolves.toEqual(server);

    });

    it('should return an error when something goes wrong', async () => {

      (server as any).server.close = jest.fn().mockImplementationOnce(() => {

        (server as any).server.emit('error', 'test error');

      });

      await expect(lastValueFrom(server.stop())).rejects.toThrow('The server ran into a problem:');

    });

  });

  describe('serverHelper()', () => {

    it('should call the handle function of the nested handler', () => {

      server.serverHelper(req, res);

      expect(handler.handle).toHaveBeenCalledTimes(1);

    });

    it('should throw an error when request is null or undefined', () => {

      expect(() => server.serverHelper((null as unknown as IncomingMessage), res)).toThrow('request must be defined.');
      expect(() => server.serverHelper((undefined as unknown as IncomingMessage), res)).toThrow('request must be defined.');

    });

    it('should throw an error when response is null or undefined', () => {

      expect(() => server.serverHelper(req, (null as unknown as ServerResponse<IncomingMessage>))).toThrow('response must be defined.');
      expect(() => server.serverHelper(req, (undefined as unknown as ServerResponse<IncomingMessage>))).toThrow('response must be defined.');

    });

  });

});
