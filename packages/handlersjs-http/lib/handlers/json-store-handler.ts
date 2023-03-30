import { from, Observable, of } from 'rxjs';
import { TimedTypedKeyValueStore } from '@digita-ai/handlersjs-storage';
import { map, switchMap } from 'rxjs/operators';
import { getLoggerFor } from '@digita-ai/handlersjs-logging';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';

export class JsonStoreHandler<T extends string, M extends { [t in T]: unknown }> implements HttpHandler {

  private logger = getLoggerFor(this);

  /**
   * Creates a HTTP handler that returns the contents of the storage data as a stringified JSON response
   *
   * @param data the key for accessing the data in a given store
   * @param store the store that contains the data
   */
  constructor(
    private readonly data: T,
    private readonly store: TimedTypedKeyValueStore<M>,
  ) { }

  /**
   * Attempts to fetch the data from the storage
   *
   * @returns the stringified storage data as a HTTP response, or a Not Found HTTP response
   */
  private tryProvideData(): Observable<HttpHandlerResponse> {

    return from(this.store.get(this.data)).pipe(map((data) =>  {

      if (data) {

        this.logger.info('Providing data ', this.data);

        return { body: JSON.stringify(data), headers: {}, status: 200 }; // OK

      }

      this.logger.warn('No data found in store for: ', this.data);

      return { body: '', headers: {}, status: 404 }; // not found

    }));

  }

  /**
   * Handles an incoming http request to fetch the storage data
   *
   * @param context
   * @returns an HTTP response
   */
  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (context?.request?.method !== 'GET') {

      this.logger.verbose('Only GET requests are supported');

      // method not allowed
      return of({ body: '', headers: { allow: 'GET' }, status: 405 });

    }

    const modifiedSince = context.request.headers['if-modified-since'];

    if (modifiedSince) {

      return from(this.store.hasUpdate(this.data, new Date(modifiedSince).getTime())).pipe(
        switchMap((hasUpdate) => {

          if (hasUpdate) return this.tryProvideData();

          this.logger.info('No data was modified ', this.data);

          return of({ body: '', headers: {}, status: 304 });

        }) // not modified
      );

    } else {

      return this.tryProvideData();

    }

  }

}
