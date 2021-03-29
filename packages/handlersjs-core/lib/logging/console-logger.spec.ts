import * as path from 'path';
import { ComponentsManager } from 'componentsjs';
import { ConsoleLogger } from './console-logger';

describe('ConsoleLogger', () => {
  let service: ConsoleLogger;

  beforeEach(async () => {
    const mainModulePath = path.join(__dirname, '../../../');
    const configPath = path.join(mainModulePath, 'config/config-test.json');

    const manager = await ComponentsManager.build({ mainModulePath });

    await manager.configRegistry.register(configPath);

    service = await manager.instantiate('urn:handlersjs-core:test:ConsoleLogger');
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should log a debug message', () => {
    service.debug('test', 'test');

    expect(service).toBeTruthy();
  });
});
