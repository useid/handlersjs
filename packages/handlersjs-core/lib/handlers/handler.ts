import type { Observable } from 'rxjs';

export interface Handler<T = void, S = void> {

  handle(input: T): Observable<S>;

}
