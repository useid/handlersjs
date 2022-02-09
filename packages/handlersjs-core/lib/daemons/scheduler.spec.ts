import { lastValueFrom, Observable, of } from 'rxjs';
import { Handler } from '../handlers/handler';
import { Scheduler } from './scheduler';
jest.useFakeTimers();

describe('Scheduler', () => {

  const task = jest.fn();
  class TestHandler implements Handler<void, void> {

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
    await lastValueFrom(scheduler.stop()).catch((e) => undefined);

  });

  it('does not run the task on initialize', async () => {

    await expectIsNotRunning();

  });

  describe('start()', () => {

    it('will schedule the task when started', async () => {

      await lastValueFrom(scheduler.start());
      await expectIsRunning();

    });

    it('can not start when it was already running', async() => {

      await lastValueFrom(scheduler.start());
      await expect(lastValueFrom(scheduler.start())).rejects.toThrow('Scheduler was already running');

    });

  });

  describe('stop()', () => {

    it('should stop correctly', async() => {

      await lastValueFrom(scheduler.start());
      await lastValueFrom(scheduler.stop());

      await expectIsNotRunning();

    });

    it('can restart after being stopped', async () => {

      await lastValueFrom(scheduler.start());
      await lastValueFrom(scheduler.stop());
      await lastValueFrom(scheduler.start());

      await expectIsRunning();

    });

    it('can not stop when it wasn\'t running', async () => {

      await expect(lastValueFrom(scheduler.stop())).rejects.toThrow('Scheduler wasn\'t running');

    });

  });

});
