import { readFile } from 'fs/promises';
import { join, isAbsolute } from 'path';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Logger } from '@digita-ai/handlersjs-core';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerContext } from '../models/http-handler-context';
import { HttpHandlerResponse } from '../models/http-handler-response';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { UnsupportedMediaTypeHttpError } from '../errors/unsupported-media-type-http-error';
import { ForbiddenHttpError } from '../errors/forbidden-http-error';

/**
 * A { HttpHandler } that serves static assets.
 */
export class HttpHandlerStaticAssetService extends HttpHandler {

  /**
   * Creates a { HttpHandlerStaticAssetService }.
   *
   * @param { Logger } logger - The logger used to log debug messages.
   * @param { string } path - The path to the static asset.
   * @param { string } contentType - The content type of the static asset.
   */
  constructor(protected logger: Logger, private path: string, private contentType: string) {

    super();

  }

  /**
   * Confirms whether the handler can handle the given context.
   */
  canHandle(context: HttpHandlerContext): Observable<boolean> {

    this.logger.debug(HttpHandlerStaticAssetService.name, 'Checking canHandle', context.request);

    return of(true);

  }

  /**
   * Handles the context.
   * Checks if an accept header is present.
   * Checks if the content type is supported.
   * Reads the file and returns the content if the file was found.
   *
   * @param { HttpHandlerContext } context - The context to handle.
   */
  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    const canHandleAcceptHeaders = [ this.contentType, `${this.contentType.split('/')[0]}/*`, '*/*' ];

    if (!context.request?.headers?.accept) {

      return throwError(new UnsupportedMediaTypeHttpError('No accept header found'));

    }

    const reqHeaders = context.request.headers.accept.split(',').map((accept) => accept.split(';')[0]);

    if (!reqHeaders.some((contentType) => canHandleAcceptHeaders.includes(contentType.trim()))) {

      return throwError(new UnsupportedMediaTypeHttpError('Content type not supported'));

    }

    const filename = context.request.parameters?.filename;

    if(filename && filename.includes('../')) {

      return throwError(new ForbiddenHttpError());

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
      catchError(() => throwError(new NotFoundHttpError('Error while trying to read file'))),
    );

  }

}
