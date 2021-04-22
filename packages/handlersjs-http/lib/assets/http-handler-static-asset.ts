import { readFile } from 'fs/promises';
import { join } from 'path';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { Logger } from '@digita-ai/handlersjs-core';
import { HttpHandler } from '../general/http-handler';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandlerResponse } from '../general/http-handler-response';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { UnsupportedMediaTypeHttpError } from '../errors/unsupported-media-type-http-error';
import { ForbiddenHttpError } from '../errors/forbidden-http-error';

export class HttpHandlerStaticAssetService extends HttpHandler {
  constructor(protected logger: Logger, private path: string, private contentType: string) {
    super();
  }

  canHandle(context: HttpHandlerContext, response?: HttpHandlerResponse): Observable<boolean> {
    this.logger.debug(HttpHandlerStaticAssetService.name, 'Checking canHandle', context.request);
    return of(true);
  }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {
    const canHandleAcceptHeaders = [ this.contentType, `${this.contentType.split('/')[0]}/*`, '*/*' ];
    if (context.request?.headers?.accept) {
      const reqHeaders = context.request.headers.accept.split(',');
      if (!reqHeaders.some((contentType) => canHandleAcceptHeaders.includes(contentType.trim()))) {
        return throwError(new UnsupportedMediaTypeHttpError('Content type not supported'));
      }
    }

    const filename = context.request.parameters.filename;

    if(filename && filename.includes('../')) {
      return throwError(new ForbiddenHttpError());
    }

    const path = join(process.cwd(), this.path, filename||'');

    return of({ path })
      .pipe(
        switchMap((data) => from(readFile(data.path))
          .pipe(map((file) => ({ ...data, content: file.toString() })))),
        map((data) => ({
          body: data.content,
          headers: {
            'Content-Type': this.contentType,
          },
          status: 200,
        })),
        catchError(() => throwError(new NotFoundHttpError('Error while trying to read file'))),
      );
  }
}
