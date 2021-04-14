import { Observable, of, throwError } from 'rxjs';
import { HttpHandler } from '../general/http-handler';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandlerController } from '../general/http-handler-controller';
import { HttpHandlerResponse } from '../general/http-handler-response';
import { HttpHandlerRoute } from '../general/http-handler-route';

/**
 * A {HttpHandler} handling requests based on routes in a given list of {HttpHandlerController}s.
 *
 * @class
 */
export class RoutedHttpRequestHandler extends HttpHandler {

  private pathToRouteMap: Map<string, HttpHandlerRoute>;

  /**
   * Creates a RoutedHttpRequestHandler, super calls the HttpHandler class and expects a list of HttpHandlerControllers
   *
   * @param {HttpHandlerController[]} handlerControllerList - a list of HttpHandlerController objects
   */
  constructor(private handlerControllerList: HttpHandlerController[]) {
    super();

    if (!handlerControllerList) {
      throw new Error('handlerControllerList must be defined.');
    }

    this.pathToRouteMap = new Map(
      this.handlerControllerList
        .flatMap((controller) => controller.routes).map((route) => [ route.path, route ]),
    );
  }

  /**
   * Passes the {HttpHandlerContext} to the handler of the {HttpHandlerRoute} matching the request's path.
   *
   * @param {HttpHandlerContext} input - a HttpHandlerContext object containing a HttpHandlerRequest and HttpHandlerRoute
   */
  handle(input: HttpHandlerContext): Observable<HttpHandlerResponse> {
    if (!input) {
      return throwError(new Error('input must be defined.'));
    }
    if (!input.request) {
      return throwError(new Error('input.request must be defined.'));
    }

    const request = input.request;
    const path = request.path;

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
      const routeMatch = routeSegments.every((seg, i) => seg === pathSegments[i] || seg[0] === ':');
      // No matching routes found
      if (!routeMatch) {
        return false;
      }
      // add parameters and query from requestPath to the request object
      const parameters = this.extractParameters(routeSegments, pathSegments);
      request.parameters = request.parameters ? { ...request.parameters, ...parameters } : parameters;
      const query = this.extractQueryParameters(path);
      request.query = request.query ? { ...request.query, ...query } : query;
      return routeMatch;
    });
    const matchingRoute = this.pathToRouteMap.get(match);
    const methodSupported = matchingRoute?.operations.map((o) => o.method).includes(request.method);

    return matchingRoute && methodSupported ? matchingRoute.handler.handle({ request, route: matchingRoute }) : of({ body: '', headers: {}, status: 404 });
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

  private extractQueryParameters(path: string): {[key: string]: string} {
    const query = {};
    if (path.split('?').length > 1) {
      const queries = path.split('?')[1];
      queries.split('&').forEach((entry) => {
        const temp = entry.split('=');
        query[temp[0]] = decodeURIComponent(temp[1]);
      });
    }
    return query;
  }

  private extractParameters(routeSegments: string[], pathSegments: string[]): {[key: string]: string} {
    const parameters = {};
    routeSegments.forEach((segment, i) => {
      if (segment[0] === ':') {
        const propName = segment.slice(1); // Cut ':'
        parameters[propName] = decodeURIComponent(pathSegments[i]);
      }
    });
    return parameters;
  }
}
