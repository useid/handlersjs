/* eslint-disable jest/expect-expect */
import { lastValueFrom, Observable, of } from 'rxjs';
import { Handler } from '../handlers/handler';
import { Scheduler } from './scheduler';
jest.useFakeTimers();

describe('Scheduler', () => {

  const task = jest.fn();
  class TestHandler implements Handler<void, void> {

    handle(): Observable<void> {

      task();

      return of();

    }

  }

  const expectIsRunning = () => {

    task.mockClear();
    jest.advanceTimersByTime(20);

    expect(task).toHaveBeenCalledTimes(4);

  };

  const expectIsNotRunning = () => {

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
    await lastValueFrom(scheduler.stop()).catch(() => undefined);

  });

  it('does not run the task on initialize', () => {

    expectIsNotRunning();

  });

  describe('start()', () => {

    it('will schedule the task when started', async () => {

      await lastValueFrom(scheduler.start());
      expectIsRunning();

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

      expectIsNotRunning();

    });

    it('can restart after being stopped', async () => {

      await lastValueFrom(scheduler.start());
      await lastValueFrom(scheduler.stop());
      await lastValueFrom(scheduler.start());

      expectIsRunning();

    });

    it('can not stop when it wasn\'t running', async () => {

      await expect(lastValueFrom(scheduler.stop())).rejects.toThrow('Scheduler wasn\'t running');

    });

  });

});
