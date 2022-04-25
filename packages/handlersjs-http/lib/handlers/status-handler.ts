import { readFile } from 'fs/promises';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { HttpHandler } from '../models/http-handler';
import { HttpHandlerResponse } from '../models/http-handler-response';

export class StatusHandler implements HttpHandler {

  constructor(private packagePath: string) { }

  handle(): Observable<HttpHandlerResponse> {

    return from(readFile(this.packagePath, 'utf8')).pipe(
      map((text) => JSON.parse(text)),
      map((json) => `${json.name} running version ${json.version}`),
      map((body) => ({ status: 200, body, headers: { 'Content-Type': 'text/plain' } })),
      catchError(() => throwError(() => new Error('Error while trying to read file'))),
    );

  }

}
