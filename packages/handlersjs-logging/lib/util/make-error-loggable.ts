export const makeErrorLoggable = (error: unknown): Record<string, unknown> => {

  if (error instanceof Error) {

    return {
      message: error.message,
      name: error.name,
      stack: error.stack ? error.stack.split(/\n/) : [],
    };

  }

  return { 'error': 'not-an-error' };

};
