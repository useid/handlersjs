import { lastValueFrom } from 'rxjs';
import { StatusHandler } from './status-handler';

jest.mock('fs/promises', () => ({
  readFile: jest.fn().mockImplementation((path) => {

    if (path === 'package.json') {

      return Promise.resolve(JSON.stringify({ name: 'test', version: '1.0.0' }));

    } else {

      return Promise.reject(new Error('Error while trying to read file'));

    }

  }),
}));

describe('StatusHandler', () => {

  let statusHandler: StatusHandler;

  const json = {
    name: 'test',
    version: '1.0.0',
  };

  beforeEach(() => {

    statusHandler = new StatusHandler('package.json');

  });

  it('should instantiate correctly', () => {

    expect(statusHandler).toBeTruthy();

  });

  describe('handle', () => {

    it('should return the status of the requested package.json', async () => {

      const response = lastValueFrom(statusHandler.handle());

      await expect(response).resolves.toEqual({ status: 200, body: `${json.name} running version ${json.version}`, headers: {
        'Content-Type': 'text/plain',
      } });

    });

    it('should throw if the package.json does not exist', async () => {

      delete (statusHandler as any).packagePath;

      const response = lastValueFrom(statusHandler.handle());

      await expect(response).rejects.toThrow('Error while trying to read file');

    });

  });

});
