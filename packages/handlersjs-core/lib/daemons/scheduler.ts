import { Observable, Subject } from 'rxjs';
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
    private readonly task: (() => void)
  ) {

    super();

  }

  /**
   * Starts the scheduler
   *
   * @returns itself
   */
  start(): Observable<Daemon> {

    const subject = new Subject<this>();

    if (this.currentTimeout) {

      subject.error(new Error('Scheduler was already running'));

    } else {

      this.currentTimeout = setInterval(this.task, this.interval);

      subject.next(this);
      subject.complete();

    }

    return subject;

  }

  /**
   * Stops the scheduler
   *
   * @returns itself
   */
  stop(): Observable<Daemon> {

    const subject = new Subject<this>();

    if (this.currentTimeout) {

      clearInterval(this.currentTimeout);
      this.currentTimeout = undefined;
      subject.next(this);
      subject.complete();

    } else {

      subject.error(new Error('Scheduler wasn\'t running'));

    }

    return subject;

  }

}
