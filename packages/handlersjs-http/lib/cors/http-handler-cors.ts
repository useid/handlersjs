import { Observable, of } from 'rxjs';
import { Logger } from '@digita-ai/handlersjs-core';
import { HttpHandler } from '../general/http-handler';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandlerResponse } from '../general/http-handler-response';
import { HttpHandlerCorsOptions } from './http-handler-cors-options';

export class HttpHandlerCorsService extends HttpHandler {
  constructor(protected logger: Logger, private options: HttpHandlerCorsOptions) {
    super();
  }

  canHandle(context: HttpHandlerContext, response?: HttpHandlerResponse): Observable<boolean> {
    this.logger.debug(HttpHandlerCorsService.name, 'Checking canHandle');

    return of(true);
  }

  handle(context: HttpHandlerContext, response?: HttpHandlerResponse): Observable<HttpHandlerResponse> {
    this.logger.debug(HttpHandlerCorsService.name, 'Running handle', { headers: context?.request?.headers, options: this.options });

    const corsHeaders = {};
    let status = response.status;

    const origin = this.options.origin ? this.options.origin : context.request.headers.Referer;

    corsHeaders['Access-Control-Allow-Origin'] = origin;

    if (this.options.credentials === true) {
      corsHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    if(context.request.method !== 'OPTIONS') {

      if (this.options.exposeHeaders) {
        corsHeaders['Access-Control-Expose-Headers'] = this.options.exposeHeaders.join(',');
      }

    } else {
      //  // Preflight Request

      // // If there is no Access-Control-Request-Method header or if parsing failed,
      // // do not set any additional headers and terminate this set of steps.
      // // The request is outside the scope of this specification.
      // if (!ctx.get('Access-Control-Request-Method')) {
      //   // this not preflight request, ignore it
      //   return await next();
      // }

      if (this.options.maxAge) {
        corsHeaders['Access-Control-Max-Age'] =  this.options.maxAge;
      }

      if (this.options.allowMethods) {
        corsHeaders['Access-Control-Allow-Methods'] =  this.options.allowMethods.join(',');
      } else {
        corsHeaders['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,POST,DELETE,PATCH';
      }

      if (this.options.allowHeaders) {
        corsHeaders['Access-Control-Allow-Headers'] = this.options.allowHeaders.join(',');
      } else {
        corsHeaders['Access-Control-Allow-Headers'] = context.request.headers['Access-Control-Request-Headers'];
      }

      status = 204;
    }

    return of({ ...response, headers: { ...response.headers, ...corsHeaders } });
  }
}
