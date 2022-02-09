import type { Observable } from 'rxjs';

export abstract class Handler<T = void, S = void> {

  public abstract handle(input: T): Observable<S>;

}
