import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';

export abstract class HttpCorsOptions {
  constructor(
    public origins?: string[],
    public allowMethods?: string[],
    public allowHeaders?: string[],
    public exposeHeaders?: string[],
    public credentials?: boolean,
    public maxAge?: number,
  ) { }
}

export class HttpCorsRequestHandler extends HttpHandler {

  constructor(private handler: HttpHandler, private options?: HttpCorsOptions) {
    super();
  }

  canHandle(context: HttpHandlerContext): Observable<boolean> {
    return of(true);
  }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    const { origins, allowMethods, allowHeaders, exposeHeaders, credentials, maxAge } = this.options || ({});

    const {
      ['Origin']: requestOrigin,
      ['Access-Control-Request-Method']: requestMethod,
      ['Access-Control-Request-Headers']: requestHeaders,
      ... noCorsHeaders
    } = context.request.headers;

    const noCorsRequestContext = {
      ... context,
      request: {
        ... context.request,
        headers: {
          ... noCorsHeaders,
        },
      },
    };

    const allowOrigin = origins
      ? origins.includes(requestOrigin)
        ? requestOrigin
        : undefined
      : credentials
        ? requestOrigin
        : '*';

    const allowHeadersOrRequested = allowHeaders?.join(',') ?? requestHeaders;

    if (context.request.method === 'OPTIONS') {

      /* Preflight Request */

      const routeMethods = context.route?.operations.map((op) => op.method);
      const allMethods = [ 'GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH' ];

      return this.handler.handle(noCorsRequestContext).pipe(
        map((response) => ({
          ... response,
          headers: {
            ... response.headers,
            ... allowOrigin && ({
              ... (allowOrigin !== '*') && { 'Vary': 'Origin' },
              'Access-Control-Allow-Origin': allowOrigin,
              'Access-Control-Allow-Methods': (allowMethods ?? routeMethods ?? allMethods).join(', '),
              ... (allowHeadersOrRequested) && { 'Access-Control-Allow-Headers': allowHeadersOrRequested },
              ... (credentials) && { 'Access-Control-Allow-Credentials': 'true' },
              'Access-Control-Max-Age': (maxAge ?? -1).toString(),
            }),
          },
        })),
      );

    } else {

      /* CORS Request */

      return this.handler.handle(noCorsRequestContext).pipe(
        map((response) => ({
          ... response,
          headers: {
            ... response.headers,
            ... allowOrigin && ({
              'Access-Control-Allow-Origin': allowOrigin,
              ... (allowOrigin !== '*') && { 'Vary': 'Origin' },
              ... (credentials) && { 'Access-Control-Allow-Credentials': 'true' },
              ... (exposeHeaders) && { 'Access-Control-Expose-Headers': exposeHeaders.join(',') },
            }),
          },
        })),
      );

    }
  }
}
