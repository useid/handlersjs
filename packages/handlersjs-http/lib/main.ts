/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as path from 'path';
import { ComponentsManager } from 'componentsjs';
import { LoggerLevel, PinoLogger, getLogger, setLogger } from '@useid/handlersjs-logging';
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

  setLogger(new PinoLogger(
    '-',
    LoggerLevel.trace,
    LoggerLevel.trace,
    true,
  ));

  const logger = getLogger();

  const server: NodeHttpServer = await manager.instantiate('urn:handlersjs-http:default:NodeHttpServer', { variables });

  server.start();
  logger.info('Started server using variables: ', variables);

};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
launch({});
