import path from 'path';
import { ComponentsManager } from 'componentsjs';

export const mainModulePath = path.join(__dirname, './');
export const configPath = path.join(mainModulePath, 'config/config-test.json');

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async () => { };

export class TestService {
  private static manager: ComponentsManager<unknown>;

  static async instantiate<T>(urn: string, mainModule: string, config: string): Promise<T> {
    if(!TestService.manager) {
      this.manager = await ComponentsManager.build({ mainModulePath: mainModule, logLevel: 'silly' });

      await this.manager.configRegistry.register(config);
    }

    return await this.manager.instantiate(urn);
  }
}
