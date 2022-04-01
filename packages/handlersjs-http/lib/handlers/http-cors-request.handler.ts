import { getLoggerFor } from '@digita-ai/handlersjs-logging';
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

  private logger = getLoggerFor(this, 5, 5);

  constructor(
    private handler: HttpHandler,
    private options?: HttpCorsOptions,
    private passThroughOptions: boolean = false,
  ) { }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    const { origins, allowMethods, allowHeaders, exposeHeaders, credentials, maxAge } = this.options || ({});

    const requestHeaders = context.request.headers;

    const cleanRequestHeaders = cleanHeaders(requestHeaders);

    const {
      ['origin']: requestedOrigin,
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

      this.logger.info('Processing preflight request', noCorsRequestContext);

      const routeMethods = context.route?.operations.map((op) => op.method);
      const allMethods = [ 'GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH' ];

      this.passThroughOptions ? this.logger.info('Handling context: ', noCorsRequestContext) : this.logger.info('No content found, returning 204 response for preflight request');

      const initialOptions = this.passThroughOptions
        ? this.handler.handle(noCorsRequestContext)
        : of({ status: 204, headers: {} });

      return initialOptions.pipe(
        map((response) => ({
          ... response,
          headers: cleanHeaders(response.headers),
        })),
        map((response) => {

          this.logger.info('Configuring CORS headers for response', response);

          return ({
            ... response,
            headers: {

              ... response.headers,
              ... allowOrigin && ({
                ... (allowOrigin !== '*') && { 'vary': 'origin' },
                'access-control-allow-origin': allowOrigin,
                'access-control-allow-methods': (allowMethods ?? routeMethods ?? allMethods).join(', '),
                ... (allowHeadersOrRequested) && { 'access-control-allow-headers': allowHeadersOrRequested },
                ... (credentials) && { 'access-control-allow-credentials': 'true' },
                'access-control-max-age': (maxAge ?? -1).toString(),
              }),
            },
          });

        }),
      );

    } else {

      /* CORS Request */

      this.logger.info('Processing CORS request', noCorsRequestContext);

      return this.handler.handle(noCorsRequestContext).pipe(
        map((response) => {

          this.logger.info('Configuring CORS headers for response', response);

          return ({
            ... response,
            headers: {
              ... response.headers,
              ... allowOrigin && ({
                'access-control-allow-origin': allowOrigin,
                ... (allowOrigin !== '*') && { 'vary': 'origin' },
                ... (credentials) && { 'access-control-allow-credentials': 'true' },
                ... (exposeHeaders) && { 'access-control-expose-headers': exposeHeaders.join(',') },
              }),
            },
          });

        }),
      );

    }

  }

}
