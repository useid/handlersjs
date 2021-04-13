import { Observable, of, throwError } from 'rxjs';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandler } from '../general/http-handler';
import { HttpHandlerResponse } from '../general/http-handler-response';

/**
 * A mock of an HttpHandler used for tests
 */
export class MockHttpHandler extends HttpHandler {

  /**
   * Returns a mock response: ```
   * {
   * body: 'some mock output',
   * headers: {},
   * status: 200,
   * }
   * ```
   *
   * @param {HttpHandlerContext} context - an irrelevant incoming context
   * @returns {Observable<HttpHandlerResponse>} - the mock response
   */
  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {
    if (!context) {
      return throwError(new Error('Context cannot be null or undefined'));
    }

    const response: HttpHandlerResponse = {
      body: 'some mock output',
      headers: {},
      status: 200,
    };
    return of(response);
  }

  /**
   * Indicates this handler accepts any input.
   *
   * @param {HttpHandlerContext} context - the irrelevant incoming context
   * @returns always `of(true)`
   */
  canHandle(context: HttpHandlerContext): Observable<boolean> {
    return context ? of(true) : throwError(new Error('Context cannot be null or undefined'));
  }
}
