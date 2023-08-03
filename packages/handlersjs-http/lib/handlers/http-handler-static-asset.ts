import { readFile } from 'fs/promises';
import { join, isAbsolute } from 'path';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getLogger } from '@useid/handlersjs-logging';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { UnsupportedMediaTypeHttpError } from '../errors/unsupported-media-type-http-error';
import { ForbiddenHttpError } from '../errors/forbidden-http-error';

export class HttpHandlerStaticAssetService implements HttpHandler {

  public logger = getLogger();

  constructor(private path: string, private contentType: string) { }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    const possibleAcceptHeaders = [ this.contentType, `${this.contentType.split('/')[0]}/*`, '*/*' ];

    if (!context.request?.headers?.accept) {

      this.logger.info('No accept header found', { headers: context.request.headers });
      this.logger.info('Returning default type', { contentType: this.contentType });

    } else {

      const reqHeaders = context.request.headers.accept.split(',').map((accept) => accept.split(';')[0]);

      if (!reqHeaders.some((contentType) => possibleAcceptHeaders.includes(contentType.trim()))) {

        this.logger.info('Content type not supported', { contentType: this.contentType });

        return throwError(() => new UnsupportedMediaTypeHttpError('Content type not supported'));

      }

    }

    const filename = context.request.parameters?.filename;

    if (filename && filename.includes('../')) {

      this.logger.info('This type of filename is not supported', { filename });

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
      catchError(() => {

        this.logger.info('Failed to read file: ', { filePath });

        return throwError(() => new NotFoundHttpError('Error while trying to read file'));

      }),
    );

  }

}
