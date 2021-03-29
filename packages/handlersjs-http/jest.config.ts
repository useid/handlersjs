// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  testTimeout: 300000,
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsconfig: 'tsconfig.json',
    },
  },
};

export default config;
