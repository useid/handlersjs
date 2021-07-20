import { Observable, Subject } from 'rxjs';
import { Daemon } from '../models/daemon';

export class Scheduler extends Daemon {

  private currentTimeout: NodeJS.Timeout | undefined;

  constructor(
    private readonly interval: number,
    private readonly task: (() => void)
  ) {

    super();

  }

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
