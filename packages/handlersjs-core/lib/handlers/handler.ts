import { Observable } from 'rxjs';

export abstract class Handler<T = void, S = void> {

  public abstract canHandle(input: T): Observable<boolean>;
  public abstract handle(input: T): Observable<S>;

}
