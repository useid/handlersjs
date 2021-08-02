import { ObjectScheduler } from './object-scheduler';
jest.useFakeTimers();

describe('ObjectScheduler', () => {

  const task = jest.fn();

  const object = {
    something: 5,
    method: task,
  };

  let scheduler: ObjectScheduler<'method', typeof object>;

  beforeEach(() => {

    task.mockClear();
    scheduler = new ObjectScheduler(5, object, 'method');
    object.method = task;

  });

  afterEach(async () => {

    // always stop the scheduler, ignore if an error "Scheduler wasn't running" is thrown
    await scheduler.stop().toPromise().catch((e) => undefined);

  });

  it('executes a given task', async () => {

    scheduler.start();
    jest.advanceTimersByTime(20);
    expect(task).toBeCalledTimes(4);

  });

  it('may change the task implementation over time', async () => {

    scheduler.start();
    jest.advanceTimersByTime(5);

    const task2 = jest.fn();
    object.method = task2;
    jest.advanceTimersByTime(15);

    expect(task).toBeCalledTimes(1);
    expect(task2).toBeCalledTimes(3);

  });

});
