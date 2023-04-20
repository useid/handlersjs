import { Logger } from './loggers/logger';

const loggerKey = '__LOGGER__HANDLERSJS__LOGGING__';

export const setLogger = (
  logger: Logger,
): void => {

  setGlobalLogger(logger);

};

export const getLogger = (): Logger => {

  const logger = getGlobalLogger();
  if (!logger) throw new Error('No logger was set. Set a logged using setLogger()');
  return logger;

};


const getGlobalLogger = (): Logger => {
  
  return (global as any)[loggerKey];
  
}

const setGlobalLogger = (newLogger: Logger): void => {

  (global as any)[loggerKey] = newLogger;

}
