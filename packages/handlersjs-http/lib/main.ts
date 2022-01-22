import * as path from 'path';
import { ComponentsManager } from 'componentsjs';
import { NodeHttpServer } from './servers/node/node-http-server';

export const launch: (variables: Record<string, any>) => Promise<void> = async (variables: Record<string, any>) => {

  const mainModulePath = variables['urn:handlersjs:variables:mainModulePath']
    ? path.join(process.cwd(), variables['urn:handlersjs:variables:mainModulePath'])
    : path.join(__dirname, '../');

  const configPath = variables['urn:handlersjs:variables:customConfigPath']
    ? path.join(process.cwd(), variables['urn:handlersjs:variables:customConfigPath'])
    : path.join(__dirname, '../config/config-default.json');

  const manager = await ComponentsManager.build({
    mainModulePath,
    logLevel: 'silly',
  });

  await manager.configRegistry.register(configPath);

  const server: NodeHttpServer = await manager.instantiate('urn:handlersjs-http:default:NodeHttpServer', { variables });
  server.start();

};

launch({});
