import { from, Observable, of } from 'rxjs';
import { TimedTypedKeyValueStore } from '@digita-ai/handlersjs-core';
import { map, switchMap } from 'rxjs/operators';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from 'models/http-handler-context';
import { HttpHandlerResponse } from 'models/http-handler-response';

export class JsonStoreHandler<M> extends HttpHandler {

  constructor(
    private readonly data: keyof M,
    private readonly store: TimedTypedKeyValueStore<M>,

  ) {

    super();

  }

  canHandle(context: HttpHandlerContext): Observable<boolean> {

    return of(true);

  }

  private tryProvideData(): Observable<HttpHandlerResponse> {

    return from(this.store.get(this.data)).pipe(map((data) => data ?
      { body: JSON.stringify(data), headers: {}, status: 200 } : // OK
      { body: '', headers: {}, status: 404 })); // not found

  }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (context.request.method === 'GET') {

      const modifiedSince = context.request.headers['If-Modified-Since'];

      if (modifiedSince) {

        return from(this.store.hasUpdate(this.data, new Date(modifiedSince).getTime())).pipe(
          switchMap((hasUpdate) => hasUpdate ?
            this.tryProvideData() :
            of({ body: '', headers: {}, status: 304 }))
        );

      } else {

        return this.tryProvideData();

      }

    } else {

      // method not allowed
      return of({ body: '', headers: {}, status: 405 });

    }

  }

}
