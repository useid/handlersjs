export const cleanHeaders = (headers: { [key: string]: string }): { [key: string]: string } =>
  Object.keys(headers).reduce<{ [key: string]: string }>(
    (acc, key) => {

      const lKey = key.toLowerCase();

      return acc[lKey]
        ? { ... acc, [lKey.toLowerCase()]: `${acc[lKey]},${headers[key]}` }
        : { ... acc, [lKey]: headers[key] };

    }, {} as { [key: string]: string },
  );
