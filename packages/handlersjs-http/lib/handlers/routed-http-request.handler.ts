import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerController } from '../models/http-handler-controller';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { HttpHandlerRoute } from '../models/http-handler-route';

/**
 * A {HttpHandler} handling requests based on routes in a given list of {HttpHandlerController}s.
 *
 * @class
 */
export class RoutedHttpRequestHandler extends HttpHandler {

  private pathToRouteMap: Map<string, { controller: HttpHandlerController; route: HttpHandlerRoute }>;

  /**
   * Creates a RoutedHttpRequestHandler, super calls the HttpHandler class and expects a list of HttpHandlerControllers
   *
   * @param {HttpHandlerController[]} handlerControllerList - a list of HttpHandlerController objects
   */
  constructor(private handlerControllerList: HttpHandlerController[], private defaultHandler?: HttpHandler) {

    super();

    if (!handlerControllerList) {

      throw new Error('handlerControllerList must be defined.');

    }

    this.pathToRouteMap = new Map(
      this.handlerControllerList.flatMap((controller) =>
        controller.routes.map((route) => [ route.path, { controller, route } ])),
    );

  }

  /**
   * Passes the {HttpHandlerContext} to the handler of the {HttpHandlerRoute} matching the request's path.
   *
   * @param {HttpHandlerContext} context - a HttpHandlerContext object containing a HttpHandlerRequest and HttpHandlerRoute
   */
  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (!context) {

      return throwError(new Error('context must be defined.'));

    }

    if (!context.request) {

      return throwError(new Error('context.request must be defined.'));

    }

    const request = context.request;
    const path = request.url.pathname;

    const pathSegments = path.split('?')[0].split('/').slice(1);

    // Find a matching route
    const match = Array.from(this.pathToRouteMap.keys()).find((route) => {

      const routeSegments = route.split('/').slice(1);

      // If there are different numbers of segments, then the route does not match the URL.
      if (routeSegments.length !== pathSegments.length) {

        return false;

      }

      // If each segment in the url matches the corresponding segment in the route path,
      // or the route path segment starts with a ':' then the route is matched.
      return routeSegments.every((seg, i) => seg === pathSegments[i] || seg[0] === ':');

    });

    const matchingRoute = match ? this.pathToRouteMap.get(match) : undefined;

    if (!matchingRoute && !this.defaultHandler) {

      return of({ body: '', headers: {}, status: 404 });

    }

    if (matchingRoute) {

      const allowedMethods = matchingRoute.route.operations.map((op) => op.method);
      const methodSupported = allowedMethods.includes(request.method);

      if (!methodSupported) {

        return of({ body: '', headers: { Allow: allowedMethods.join(', ') }, status: 405 });

      }

      // add parameters from requestPath to the request object
      const parameters = this.extractParameters(matchingRoute.route.path.split('/').slice(1), pathSegments);
      const requestWithParams = Object.assign(request, { parameters });
      const newContext = { request: requestWithParams, route: matchingRoute.route };
      const preResponseHandler = matchingRoute.controller.preResponseHandler;

      return (preResponseHandler ? preResponseHandler.handle(newContext) : of(newContext)).pipe(
        switchMap((preresponse) => matchingRoute.route.handler.handle(preresponse)),
        map((response) => ({
          ... response,
          headers: {
            ... response.headers,
            ... (request.method === 'OPTIONS') && { Allow: allowedMethods.join(', ') },
          },
        })),
      );

    } else {

      return this.defaultHandler.handle(context);

    }

  }

  /**
   * Indicates that this handler can handle every `HttpHandlerContext `.
   *
   * @returns always `of(true)`
   * @param {HttpHandlerContext} context - a HttpHandlerContext object containing a HttpHandlerRequest and HttpHandlerRoute
   */
  canHandle(context: HttpHandlerContext): Observable<boolean> {

    return context && context.request ? of(true) : of(false);

  }

  private extractParameters(routeSegments: string[], pathSegments: string[]): { [key: string]: string } {

    const parameters: { [key: string]: string } = {};

    routeSegments.forEach((segment, i) => {

      if (segment[0] === ':') {

        const propName = segment.slice(1); // Cut ':'
        parameters[propName] = decodeURIComponent(pathSegments[i]);

      }

    });

    return parameters;

  }

}
