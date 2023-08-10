/* eslint-disable jest/no-identical-title */
/* eslint-disable @typescript-eslint/unbound-method */
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import { lastValueFrom, of, throwError } from 'rxjs';
import * as mockhttp from 'mock-http';
import { HttpHandler } from '../../models/http-handler';
import { BadRequestHttpError } from '../../errors/bad-request-http-error';
import { HttpHandlerContext } from '../../models/http-handler-context';
import { NodeHttpRequestResponseHandler } from './node-http-request-response.handler';
import { NodeHttpStreams } from './node-http-streams.model';

describe('NodeHttpRequestResponseHandler', () => {

  let handler: NodeHttpRequestResponseHandler;
  let nestedHttpHandler: HttpHandler;
  let streamMock: NodeHttpStreams;
  let req: IncomingMessage;
  let res: ServerResponse;
  const bufferString = 'bodyString';
  const buffer = Buffer.from(bufferString);

  beforeEach(async () => {

    nestedHttpHandler = { handle: jest.fn().mockReturnValueOnce(of({ body: 'mockBody', headers: { mockKey: 'mockValue' }, status: 200 })) };

    handler = new NodeHttpRequestResponseHandler(nestedHttpHandler);

    req = new mockhttp.Request({
      url: '/test?works=yes',
      method: 'GET',
      buffer,
      headers: {
        host: 'localhost:3000',
      },
    });

    res = new mockhttp.Response();
    res.write = jest.fn();
    res.writeHead = jest.fn();
    res.end = jest.fn();

    streamMock = {
      requestStream: req,
      responseStream: res,
    };

  });

  it('should be correctly instantiated if handler is present', () => {

    expect(handler).toBeTruthy();

  });

  it('throws when handler is null or undefined', () => {

    expect(() => new NodeHttpRequestResponseHandler((null as unknown as HttpHandler<HttpHandlerContext>))).toThrow('A HttpHandler must be provided');

    expect(() => new NodeHttpRequestResponseHandler((undefined as unknown as HttpHandler<HttpHandlerContext>))).toThrow('A HttpHandler must be provided');

  });

  it('nested should be correctly instantiated', () => {

    expect(nestedHttpHandler).toBeTruthy();

  });

  describe('handle', () => {

    it('throws when streams is null/undefined', async () => {

      await expect(lastValueFrom(handler.handle((null as unknown as NodeHttpStreams)))).rejects.toThrow('node http streams object cannot be null or undefined.');
      await expect(lastValueFrom(handler.handle((undefined as unknown as NodeHttpStreams)))).rejects.toThrow('node http streams object cannot be null or undefined.');

    });

    it('throws when request stream is null/undefined', async () => {

      streamMock.requestStream = (null as unknown as IncomingMessage);

      expect(streamMock.requestStream).toBeNull();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('request stream cannot be null or undefined.');

      streamMock.requestStream = (undefined as unknown as IncomingMessage);

      expect(streamMock.requestStream).toBeUndefined();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('request stream cannot be null or undefined.');

    });

    it('throws when response stream is null/undefined', async () => {

      streamMock.responseStream = (null as unknown as ServerResponse);

      expect(streamMock.responseStream).toBeNull();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('response stream cannot be null or undefined.');

      streamMock.responseStream = (undefined as unknown as ServerResponse);

      expect(streamMock.responseStream).toBeUndefined();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('response stream cannot be null or undefined.');

    });

    it('throws when url is null/undefined', async () => {

      streamMock.requestStream.url = (null as unknown as string);

      expect(streamMock.requestStream.url).toBeNull();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('url of the request cannot be null or undefined.');

      streamMock.requestStream.url = undefined;

      expect(streamMock.requestStream.url).toBeUndefined();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('url of the request cannot be null or undefined.');

    });

    it('throws when method is null/undefined', async () => {

      streamMock.requestStream.method = (null as unknown as string);

      expect(streamMock.requestStream.method).toBeNull();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('method of the request cannot be null or undefined.');

      streamMock.requestStream.method = undefined;

      expect(streamMock.requestStream.method).toBeUndefined();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('method of the request cannot be null or undefined.');

    });

    it('should return 501 when request method is not an HTTP method', async () => {

      // This is a valid header in the WebDAV protocol
      streamMock.requestStream.method = 'PROPFIND';
      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.writeHead).toHaveBeenCalledWith(
        501,
        { 'Content-Type': 'application/json' },
      );

    });

    it('throws when headers is null/undefined', async () => {

      streamMock.requestStream.headers = (null as unknown as IncomingHttpHeaders);

      expect(streamMock.requestStream.headers).toBeNull();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('headers of the request cannot be null or undefined.');

      streamMock.requestStream.headers = (undefined as unknown as IncomingHttpHeaders);

      expect(streamMock.requestStream.headers).toBeUndefined();
      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('headers of the request cannot be null or undefined.');

    });

    it('should set the body in the request if found in the request stream', async () => {

      await lastValueFrom(handler.handle(streamMock));

      expect(nestedHttpHandler.handle).toHaveBeenCalledTimes(1);

      expect(nestedHttpHandler.handle).toHaveBeenCalledWith({
        request: {
          method: streamMock.requestStream.method,
          headers: streamMock.requestStream.headers,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          url: new URL((streamMock.requestStream.url as string), `http://${streamMock.requestStream.headers.host}`),
          body: bufferString,
        },
      });

    });

    it('should call the nested handlers handle method', async () => {

      await lastValueFrom(handler.handle(streamMock));

      expect(nestedHttpHandler.handle).toHaveBeenCalledTimes(1);

    });

    it('should write the headers to response stream', async () => {

      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          mockKey: 'mockValue',
          'content-length': Buffer.byteLength('mockBody', 'utf-8').toString(),
          'x-request-id': expect.any(String),
          'x-correlation-id': expect.any(String),
        }),
      );

    });

    it('should return the given request and correlation id', async () => {

      const requestId = '123';
      const correlationId = '567';
      streamMock.requestStream.headers['x-request-id'] = requestId;
      streamMock.requestStream.headers['x-correlation-id'] = correlationId;
      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'x-request-id': requestId,
          'x-correlation-id': correlationId,
        }),
      );

    });

    it('should return the first given request and correlation id when array', async () => {

      const requestId = '123';
      const correlationId = '567';
      streamMock.requestStream.headers['x-request-id'] = [ requestId, 'zzz' ];
      streamMock.requestStream.headers['x-correlation-id'] = [ correlationId, 'zzz' ];
      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'x-request-id': requestId,
          'x-correlation-id': correlationId,
        }),
      );

    });

    it('should write the body to response stream', async () => {

      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.write).toHaveBeenCalledWith('mockBody');

    });

    it('should close the output stream', async () => {

      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.end).toHaveBeenCalledTimes(1);

    });

    it('should parse the url correctly', async () => {

      await lastValueFrom(handler.handle(streamMock));

      expect(nestedHttpHandler.handle).toHaveBeenCalledTimes(1);

      expect(nestedHttpHandler.handle).toHaveBeenCalledWith(expect.objectContaining({
        request: expect.objectContaining({
          url: new URL(`http://${streamMock.requestStream.headers.host}${streamMock.requestStream.url}`),
        }),
      }));

    });

    it('should remove excessive slashes at start of requestStream.url', async () => {

      const path = 'remove-em-pls';
      streamMock.requestStream.url = `//${path}`;
      await lastValueFrom(handler.handle(streamMock));

      expect(nestedHttpHandler.handle).toHaveBeenCalledTimes(1);

      expect(nestedHttpHandler.handle).toHaveBeenCalledWith(expect.objectContaining({
        request: expect.objectContaining({
          url: new URL(`http://${streamMock.requestStream.headers.host}/${path}`),
        }),
      }));

    });

    it('should calculate the content-length of the response body as utf-8 when no charset is present', async () => {

      const body = 'This is a response body with a certain length.';
      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body, headers: { }, status: 200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(200, expect.objectContaining({ 'content-length': Buffer.byteLength(body, 'utf-8').toString() }));
      expect(res.write).toHaveBeenCalledWith(body);
      expect(res.end).toHaveBeenCalledTimes(1);

    });

    it('should calculate the content-length of the response body with the given charset', async () => {

      const body = Buffer.from('This is a response body with a certain length.').toString('base64');
      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body, headers: { 'content-type': 'text/html; charset=base64' }, status:200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'content-length': Buffer.byteLength(body, 'base64').toString(),
          'content-type': 'text/html; charset=base64',
        }),
      );

      expect(res.write).toHaveBeenCalledWith(body);
      expect(res.end).toHaveBeenCalledTimes(1);

    });

    it('should not calculate content-length when response does not contain a body', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ headers: { mockKey: 'mockValue' }, status:200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(200, expect.objectContaining({ mockKey: 'mockValue' }));
      expect(res.write).toHaveBeenCalledTimes(0);
      expect(res.end).toHaveBeenCalledTimes(1);

    });

    it('should return the response body when the body is equal to false', async () => {

      const body = false;

      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body, headers: { 'content-type': 'application/json;' }, status:200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.write).toHaveBeenCalledWith(JSON.stringify(body));
      expect(res.end).toHaveBeenCalledTimes(1);

    });

    it('should error if the charset is not supported', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body: 'mockBody', headers: { 'content-type': 'text/html; charset=unsupported' }, status:200 }));

      await expect(lastValueFrom(handler.handle(streamMock))).rejects.toThrow('The specified charset is not supported');

    });

    it('should set the charset to utf-8 if no content-type header is specified', async () => {

      const body = 'This is a response body with a certain length.';
      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body, headers: { 'content-type': 'text/html;' }, status:200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'content-length': Buffer.byteLength(body, 'utf-8').toString(),
          'content-type': 'text/html;',
        }),
      );

    });

    it('should set the charset to utf-8 if no charset is specified in the content-type header', async () => {

      const body = 'This is a response body with a certain length.';
      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body, headers: { 'content-type': 'text/html;' }, status:200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'content-length': Buffer.byteLength(body, 'utf-8').toString(),
          'content-type': 'text/html;',
        }),
      );

    });

    it('should set the charset to utf-8 if no content-type header is specified', async () => {

      const body = 'This is a response body with a certain length.';
      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body, headers: {}, status:200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(200, expect.objectContaining({ 'content-length': Buffer.byteLength(body, 'utf-8').toString() }));

    });

    it('should JSON stringify the response body if the body type is not string', async () => {

      const body = 1234;
      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(of({ body, headers: { 'content-type': 'text/html' }, status:200 }));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'content-length': Buffer.byteLength(body.toString(), 'utf-8').toString(),
          'content-type': 'text/html',
        }),
      );

    });

    it('should catch objects with the given status if the status is within the 400-599 range', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(throwError(() => ({ headers: {}, status: 409 })));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(409, expect.any(Object));
      expect(res.write).toHaveBeenCalledWith('Internal Server Error');

    });

    it('should catch objects with any status that is not matched and if the status is not within 400-599 return a 500 response', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(throwError(() => ({ headers: {}, status: 399 })));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(500, expect.any(Object));
      expect(res.write).toHaveBeenCalledWith('Internal Server Error');

    });

    it('should catch objects with any status that is not matched and if the status is not within 400-599 return a 500 response', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(throwError(() => ({ headers: {}, status: 600 })));

      await lastValueFrom(handler.handle(streamMock));

      expect(res.writeHead).toHaveBeenCalledWith(500, expect.any(Object));
      expect(res.write).toHaveBeenCalledWith('Internal Server Error');

    });

    it('should add a x-powered-by response header', async () => {

      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'x-powered-by': 'handlers.js',
        }),
      );

    });

    it('should write strict-transport-security header to the response', async () => {

      handler = new NodeHttpRequestResponseHandler(
        nestedHttpHandler,
        'handlers.js',
        { includeSubDomains: true, maxAge: 7200 },
      );

      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'strict-transport-security': 'max-age=7200; includeSubDomains',
        }),
      );

    });

    it('should write strict-transport-security header to the response, but not include "includeSubDomains" if specified', async () => {

      handler = new NodeHttpRequestResponseHandler(
        nestedHttpHandler,
        'handlers.js',
        { includeSubDomains: false, maxAge: 5000 },
      );

      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({
          'strict-transport-security': 'max-age=5000',
        }),
      );

    });

    it('should not log Buffers', async () => {

      nestedHttpHandler.handle = jest.fn().mockReturnValueOnce(
        of({ body: Buffer.from('Boeffer'), headers: { }, status:200 }),
      );

      handler = new NodeHttpRequestResponseHandler(nestedHttpHandler);
      const loggerSpy = jest.spyOn(handler.logger, 'info');
      await lastValueFrom(handler.handle(streamMock));

      expect(streamMock.responseStream.write).toHaveBeenCalledWith(expect.any(Buffer));

      expect(loggerSpy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        eventType: 'domestic_response',
        response: expect.objectContaining({
          body: '<Buffer>',
        }),
      }));

    });

  });

  describe('parseBody', () => {

    it('should return the body JSON parsed if content type is application/json', async () => {

      const parsed = (handler as any).parseBody('{"name":"jasper","surname":"vandenberghen"}', 'application/json');

      expect(parsed).toEqual({ name: 'jasper', surname: 'vandenberghen' });

    });

    it('should return the body x-www-form-urlencoded UNPARSED if content type is x-www-form-urlencoded', async () => {

      const parsed = (handler as any).parseBody('name=jasper&surname=vandenberghen', 'application/x-www-form-urlencoded');

      // expect(parsed).toEqual({ name: 'jasper', surname: 'vandenberghen' });
      expect(parsed).toBe('name=jasper&surname=vandenberghen');

    });

    it('should return the body if content type is default', async () => {

      const parsed = (handler as any).parseBody('{"name":"jasper","surname":"vandenberghen"}', 'text/plain');

      expect(parsed).toBe('{"name":"jasper","surname":"vandenberghen"}');

    });

    it('should error when parser fails', () => {

      expect(() => (handler as any).parseBody('{""}', 'application/json')).toThrow(BadRequestHttpError);

    });

  });

  describe('parseResponseBody', () => {

    it('should return the body if content type is application/json and body is string', async () => {

      const body = '{"name":"name","surname":"surname"}';

      const parsed = (handler as any).parseResponseBody(body, 'application/json');

      expect(parsed).toEqual(body);

    });

    it('should return the stringified body if content type is application/json and body is object', async () => {

      const body = { name: 'name', surname: 'surname' };

      const parsed = (handler as any).parseResponseBody(body, 'application/json');

      expect(parsed).toEqual(JSON.stringify(body));

    });

  });

});
