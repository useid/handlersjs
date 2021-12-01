import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * { Handler<T = void, S = void> } containing 2 abstract methods: canHandle and handle.
 * And a safeHandle method default implementation that checks if the handler can handle the request and then calls handle.
 */
export abstract class Handler<T = void, S = void> {

  public abstract canHandle(input: T, intermediateOutput?: S): Observable<boolean>;
  public abstract handle(input: T, intermediateOutput?: S): Observable<S>;

  safeHandle(input: T, intermediateOutput: S): Observable<S> {

    return of({ input, intermediateOutput }).pipe(
      switchMap((data) => this.canHandle(data.input, data.intermediateOutput).pipe(
        map((canHandleResult) => ({ ...data, canHandleResult })),
      )),
      switchMap((data) =>
        (data.canHandleResult ? this.handle(data.input, data.intermediateOutput) : of(data.intermediateOutput)).pipe(
          map((handleResult) => ({ ...data, handleResult })),
        )),
      map((data) => data.handleResult),
    );

  }

}
