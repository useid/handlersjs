import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { cleanHeaders } from '../util/clean-headers';

export interface HttpCorsOptions {
  origins?: string[];
  allowMethods?: string[];
  allowHeaders?: string[];
  exposeHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}
export class HttpCorsRequestHandler implements HttpHandler {

  constructor(
    private handler: HttpHandler,
    private options?: HttpCorsOptions,
    private passThroughOptions: boolean = false,
  ) { }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    context.logger.setLabel(this);

    const { origins, allowMethods, allowHeaders, exposeHeaders, credentials, maxAge } = this.options || ({});

    const requestHeaders = context.request.headers;

    const cleanRequestHeaders = cleanHeaders(requestHeaders);

    const {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructuring for removal */
      ['access-control-request-method']: requestedMethod,
      ['access-control-request-headers']: requestedHeaders,
      ... noCorsHeaders
    } = cleanRequestHeaders;

    const noCorsRequestContext = {
      ... context,
      request: {
        ... context.request,
        headers: {
          ... noCorsHeaders,
        },
      },
    };

    const { origin: requestedOrigin } = cleanRequestHeaders;

    const allowOrigin = origins
      ? origins.includes(requestedOrigin)
        ? requestedOrigin
        : undefined
      : credentials
        ? requestedOrigin
        : '*';

    const allowHeadersOrRequested = allowHeaders?.join(',') ?? requestedHeaders;

    if (context.request.method === 'OPTIONS') {

      /* Preflight Request */

      context.logger.info('Processing preflight request', noCorsRequestContext);

      const routeMethods = context.route?.operations.map((op) => op.method);
      const allMethods = [ 'GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH' ];

      this.passThroughOptions ? context.logger.info('Handling context: ', noCorsRequestContext) : context.logger.info('No content found, returning 204 response for preflight request');

      const initialOptions = this.passThroughOptions
        ? this.handler.handle(noCorsRequestContext)
        : of({ status: 204, headers: {} });

      return initialOptions.pipe(
        map((response) => ({
          ... response,
          headers: cleanHeaders(response.headers),
        })),
        tap(() => context.logger.info('Configuring CORS headers for response')),
        map((response) => ({
          ... response,
          headers: {

            ... response.headers,
            ... allowOrigin && ({
              ... (allowOrigin !== '*') && { 'vary': [ ... new Set([ ... response.headers.vary?.split(',').map((v) => v.trim().toLowerCase()) ?? [], `origin` ]) ].join(', ') },
              'access-control-allow-origin': allowOrigin,
              'access-control-allow-methods': (allowMethods ?? routeMethods ?? allMethods).join(', '),
              ... (allowHeadersOrRequested) && { 'access-control-allow-headers': allowHeadersOrRequested },
              ... (credentials) && { 'access-control-allow-credentials': 'true' },
              'access-control-max-age': (maxAge ?? -1).toString(),
            }),
          },
        })),
      );

    } else {

      /* CORS Request */

      context.logger.info('Processing CORS request', noCorsRequestContext);

      return this.handler.handle(noCorsRequestContext).pipe(
        tap(() => context.logger.info('Configuring CORS headers for response')),
        map((response) => ({
          ... response,
          headers: {
            ... response.headers,
            ... allowOrigin && ({
              'access-control-allow-origin': allowOrigin,
              ... (allowOrigin !== '*') && { 'vary': [ ... new Set([ ... response.headers.vary?.split(',').map((v) => v.trim().toLowerCase()) ?? [], `origin` ]) ].join(', ') },
              ... (credentials) && { 'access-control-allow-credentials': 'true' },
              ... (exposeHeaders) && { 'access-control-expose-headers': exposeHeaders.join(',') },
            }),
          },
        })),
      );

    }

  }

}
