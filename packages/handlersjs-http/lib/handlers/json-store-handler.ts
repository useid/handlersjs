import { Observable, of } from 'rxjs';
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

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    const modifiedSince = context.request.headers['If-Modified-Since'];

    if (!modifiedSince || this.store.hasUpdate(this.data, new Date(modifiedSince).getTime())) {

      return of({ body: JSON.stringify(this.store.get(this.data)), headers: {}, status: 200 });

    } else {

      return of({ body: '', headers: {}, status: 304 });

    }

  }

}
