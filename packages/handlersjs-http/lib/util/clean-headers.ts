export const cleanHeaders = (headers: { [key: string]: string }): { [key: string]: string } =>
  Object.keys(headers).reduce<{ [key: string]: string }>(
    (acc, key) => {

      const lKey = key.toLowerCase();

      return acc[lKey]
        ? { ... acc, [lKey.toLowerCase()]: `${acc[lKey]},${headers[key]}` }
        : { ... acc, [lKey]: headers[key] };

    },
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    {} as { [key: string]: string },
  );
