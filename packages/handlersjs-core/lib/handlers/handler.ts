import { Observable, of } from 'rxjs';

export abstract class Handler<T = void, S = void> {

  public abstract handle(input: T): Observable<S>;

  canHandle(input: T): Observable<boolean> {

    return of(true);

  }

}
