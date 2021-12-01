import { from, Observable, of } from 'rxjs';
import { TimedTypedKeyValueStore } from '@digita-ai/handlersjs-core';
import { map, switchMap } from 'rxjs/operators';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';

/**
 * A handler that returns the contents of the storage data as a stringified JSON response
 */
export class JsonStoreHandler<T extends string, M extends { [t in T]: unknown }> extends HttpHandler {

  /**
   * Creates a { JSONStoreHandler }.
   *
   * @param { T } data - The key for accessing the data in a given store
   * @param { TimedTypedKeyValueStore } store the store that contains the data
   */
  constructor(
    private readonly data: T,
    private readonly store: TimedTypedKeyValueStore<M>,
  ) { super(); }

  canHandle(context: HttpHandlerContext): Observable<boolean> {

    return of(true);

  }

  /**
   * Attempts to fetch the data from the storage.
   *
   * @returns the stringified storage data as a HTTP response, or a Not Found HTTP response
   */
  private tryProvideData(): Observable<HttpHandlerResponse> {

    return from(this.store.get(this.data)).pipe(map((data) => data
      ? { body: JSON.stringify(data), headers: {}, status: 200 } // OK
      : { body: '', headers: {}, status: 404 })); // not found

  }

  /**
   * Handles an incoming http request to fetch the storage data.
   * If a if-modified-since header is present checks the store for updates and returns the data as a JSON response if updated.
   * If not replies with a Not Modified HTTP response.
   *
   * @param { HttpHandlerContext } context - The context containing the request to handle.
   */
  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (context?.request?.method !== 'GET') {

      // method not allowed
      return of({ body: '', headers: { allow: 'GET' }, status: 405 });

    }

    const modifiedSince = context.request.headers['if-modified-since'];

    if (modifiedSince) {

      return from(this.store.hasUpdate(this.data, new Date(modifiedSince).getTime())).pipe(
        switchMap((hasUpdate) => hasUpdate
          ? this.tryProvideData()
          : of({ body: '', headers: {}, status: 304 })) // not modified
      );

    } else {

      return this.tryProvideData();

    }

  }

}
