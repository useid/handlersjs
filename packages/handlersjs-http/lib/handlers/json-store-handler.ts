import { Observable, of, Subscriber } from 'rxjs';
import { TimedTypedKeyValueStore } from '@digita-ai/handlersjs-core';
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

  private tryProvideData(subscriber: Subscriber<HttpHandlerResponse>) {

    this.store.get(this.data).then((storedData) => {

      if (storedData) {

        // OK
        subscriber.next({ body: JSON.stringify(storedData), headers: {}, status: 200 });

      } else {

        // not found
        subscriber.next({ body: '', headers: {}, status: 404 });

      }

      subscriber.complete();

    });

  }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (context.request.method === 'GET') {

      return new Observable((subscriber) => {

        const modifiedSince = context.request.headers['If-Modified-Since'];

        if (modifiedSince) {

          this.store.hasUpdate(this.data, new Date(modifiedSince).getTime()).then((hasUpdate) => {

            if (hasUpdate === false) {

              // not modified
              subscriber.next({ body: '', headers: {}, status: 304 });
              subscriber.complete();

            } else {

              this.tryProvideData(subscriber);

            }

          });

        } else {

          this.tryProvideData(subscriber);

        }

      });

    } else {

      // method not allowed
      return of({ body: '', headers: {}, status: 405 });

    }

  }

}
