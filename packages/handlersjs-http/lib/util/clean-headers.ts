import { getLogger } from '@digita-ai/handlersjs-logging';

const logger = getLogger();
export const cleanHeaders = (headers: { [key: string]: string }): { [key: string]: string } =>
  Object.keys(headers).reduce<{ [key: string]: string }>(
    (acc, key) => {

      logger.info('Cleaning headers', { key, value: headers[key] });

      const lKey = key.toLowerCase();

      return acc[lKey]
        ? { ... acc, [lKey.toLowerCase()]: `${acc[lKey]},${headers[key]}` }
        : { ... acc, [lKey]: headers[key] };

    }, {} as { [key: string]: string },
  );
