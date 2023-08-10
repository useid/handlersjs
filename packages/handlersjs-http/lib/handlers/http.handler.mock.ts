import { Observable, of } from 'rxjs';
import { getLogger } from '@useid/handlersjs-logging';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerResponse } from '../models/http-handler-response';

/**
 * A mock of an HttpHandler used for tests
 */
export class MockHttpHandler implements HttpHandler {

  public logger = getLogger();

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

    this.logger.info('mock handling');

    const response: HttpHandlerResponse = {
      // body: 'a'.repeat(2000) + ' - not in domestic response log',
      body: Buffer.from(`some mock output (${context.request.url.toString()})`),
      // headers: { 'content-length': '200' },
      headers: {},
      status: 200,
    };

    return of(response);

  }

}
