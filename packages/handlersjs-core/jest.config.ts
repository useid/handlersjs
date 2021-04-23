// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  moduleFileExtensions: [ 'ts', 'js' ],
  testRegex: '.spec.ts$',
  coverageDirectory: '../coverage',
  collectCoverageFrom: [ '**/*.{ts,js}' ],
  coveragePathIgnorePatterns: [ 'public-api.ts' ],
  // coverageThreshold: {
  //   global: {
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //     statements: 60,
  //   },
  // },
  testTimeout: 300000,
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};

export default config;
