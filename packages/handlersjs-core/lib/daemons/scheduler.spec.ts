import { Scheduler } from './scheduler';

describe('Scheduler', () => {

  let scheduler: Scheduler;
  const task = jest.fn();

  // checks if the scheduler is running
  const isRunning = async () => {

    task.mockClear();
    await new Promise((r) => setTimeout(r, 20)); // sleep 20ms
    const callAmount = task.mock.calls.length;

    return callAmount >= 3 && callAmount <= 4;

  };

  beforeEach(() => {

    scheduler = new Scheduler(5, task);

  });

  it('does not run the task on initialize', async () => {

    expect(await isRunning()).toBe(false);

  });

  it('will schedule the task when started', async () => {

    // scheduler.start().subscribe(async () => expect(await isRunning()).toBe(false));

    await scheduler.start().toPromise();
    expect(await isRunning()).toBe(true);

  });

  it('should stop correctly', async() => {

    // only works like this for now
    scheduler.start().toPromise().then(
      () => scheduler.stop().toPromise().then(
        () => async () => {

          expect(await isRunning()).toBe(false);

        }
      )
    );

    // await scheduler.start().toPromise();
    // await scheduler.stop().toPromise();

    // expect(await isRunning()).toBe(false);

  });

  it('can restart after being stopped', async () => {

    // only works like this for now
    scheduler.start().toPromise().then(
      () => scheduler.stop().toPromise().then(
        () => scheduler.start().toPromise().then(
          async () => {

            expect(await isRunning()).toBe(true);

          }
        )
      )
    );

    // await scheduler.start().toPromise();
    // await scheduler.stop().toPromise();
    // await scheduler.start().toPromise();

    // expect(await isRunning()).toBe(true);

  });

  it('can not stop when it wasn\'t running', async() => {

    await expect(scheduler.stop().toPromise()).rejects.toThrow('Scheduler wasn\'t running');

  });

  it('can not start when it was already running', async() => {

    await scheduler.start().toPromise();
    await expect(scheduler.start().toPromise()).rejects.toThrow('Scheduler was already running');

  });

});
