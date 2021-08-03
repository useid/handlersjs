import { Observable, of } from 'rxjs';
import { Handler } from '../handlers/handler';
import { Scheduler } from './scheduler';
jest.useFakeTimers();

describe('Scheduler', () => {

  const task = jest.fn();
  class TestHandler extends Handler<void, void> {

    canHandle(input: void, intermediateOutput?: void): Observable<boolean> {

      return of(true);

    }
    handle(input: void, intermediateOutput?: void): Observable<void> {

      task();

      return of();

    }

  }

  const expectIsRunning = async () => {

    task.mockClear();
    jest.advanceTimersByTime(20);
    expect(task).toBeCalledTimes(4);

  };

  const expectIsNotRunning = async () => {

    task.mockClear();
    jest.advanceTimersByTime(20);
    expect(task).not.toHaveBeenCalled();

  };

  let scheduler: Scheduler;

  beforeEach(() => {

    scheduler = new Scheduler(5, new TestHandler());

  });

  afterEach(async () => {

    // always stop the scheduler, ignore if an error "Scheduler wasn't running" is thrown
    await scheduler.stop().toPromise().catch((e) => undefined);

  });

  it('does not run the task on initialize', async () => {

    await expectIsNotRunning();

  });

  describe('start()', () => {

    it('will schedule the task when started', async () => {

      // scheduler.start().subscribe(async () => expect(await isRunning()).toBe(false));

      await scheduler.start().toPromise();
      await expectIsRunning();

    });

    it('can not start when it was already running', async() => {

      await scheduler.start().toPromise();
      await expect(scheduler.start().toPromise()).rejects.toThrow('Scheduler was already running');

    });

  });

  describe('stop()', () => {

    it('should stop correctly', async() => {

      await scheduler.start().toPromise();
      await scheduler.stop().toPromise();

      await expectIsNotRunning();

    });

    it('can restart after being stopped', async () => {

      await scheduler.start().toPromise();
      await scheduler.stop().toPromise();
      await scheduler.start().toPromise();

      await expectIsRunning();

    });

    it('can not stop when it wasn\'t running', async () => {

      await expect(scheduler.stop().toPromise()).rejects.toThrow('Scheduler wasn\'t running');

    });

  });

});
