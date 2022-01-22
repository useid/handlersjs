import { readFile } from 'fs/promises';
import { join, isAbsolute } from 'path';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { UnsupportedMediaTypeHttpError } from '../errors/unsupported-media-type-http-error';
import { ForbiddenHttpError } from '../errors/forbidden-http-error';

export class HttpHandlerStaticAssetService extends HttpHandler {

  constructor(private path: string, private contentType: string) {

    super();

  }

  canHandle(context: HttpHandlerContext): Observable<boolean> {

    return of(true);

  }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    const canHandleAcceptHeaders = [ this.contentType, `${this.contentType.split('/')[0]}/*`, '*/*' ];

    if (!context.request?.headers?.accept) {

      return throwError(() => new UnsupportedMediaTypeHttpError('No accept header found'));

    }

    const reqHeaders = context.request.headers.accept.split(',').map((accept) => accept.split(';')[0]);

    if (!reqHeaders.some((contentType) => canHandleAcceptHeaders.includes(contentType.trim()))) {

      return throwError(() => new UnsupportedMediaTypeHttpError('Content type not supported'));

    }

    const filename = context.request.parameters?.filename;

    if(filename && filename.includes('../')) {

      return throwError(() => new ForbiddenHttpError());

    }

    const filePath = join(isAbsolute(this.path) ? this.path : join(process.cwd(), this.path), filename || '');

    return from(readFile(filePath)).pipe(
      map((file) => ({
        body: file.toString(),
        headers: {
          'Content-Type': this.contentType,
        },
        status: 200,
      })),
      catchError(() => throwError(() => new NotFoundHttpError('Error while trying to read file'))),
    );

  }

}
