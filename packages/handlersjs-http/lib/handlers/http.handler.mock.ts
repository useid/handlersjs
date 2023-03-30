import { Observable, of, throwError } from 'rxjs';
import { getLoggerFor } from '@digita-ai/handlersjs-logging';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerResponse } from '../models/http-handler-response';

/**
 * A mock of an HttpHandler used for tests
 */
export class MockHttpHandler implements HttpHandler {

  private logger = getLoggerFor(this);

  /**
   * Returns a mock response: ```
   * {
   * body: 'some mock output',
   * headers: {},
   * status: 200,
   * }
   * ```
   *
   * @param { HttpHandlerContext } context - an irrelevant incoming context
   * @returns { Observable<HttpHandlerResponse> } - the mock response
   */
  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (!context) {

      this.logger.verbose('No context provided');

      return throwError(() => new Error('Context cannot be null or undefined'));

    }

    const response: HttpHandlerResponse = {
      body: 'some mock output',
      headers: {},
      status: 200,
    };

    return of(response);

  }

}
