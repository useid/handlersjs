import { Observable, of, throwError } from 'rxjs';
import { Handler } from '../handlers/handler';
import { Daemon } from '../models/daemon';

export class Scheduler extends Daemon {

  private currentTimeout: NodeJS.Timeout | undefined;

  /**
   * A scheduler is a daemon that, when started, executes a given task on-repeat
   *
   * @param interval the interval inbetween tasks
   * @param task the task to execute
   */
  constructor(
    private readonly interval: number,
    private readonly task: Handler<void, void>,
  ) { super(); }

  /**
   * Starts the scheduler
   *
   * @returns itself
   */
  start(): Observable<Daemon> {

    if (this.currentTimeout) {

      return throwError(() => new Error('Scheduler was already running'));

    } else {

      this.currentTimeout = setInterval(() => this.task.handle(), this.interval);

      return of(this);

    }

  }

  /**
   * Stops the scheduler
   *
   * @returns itself
   */
  stop(): Observable<Daemon> {

    if (this.currentTimeout) {

      clearInterval(this.currentTimeout);
      this.currentTimeout = undefined;

      return of(this);

    } else {

      return throwError(() => new Error("Scheduler wasn't running"));

    }

  }

}
