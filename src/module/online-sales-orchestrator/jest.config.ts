import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  displayName: 'online-sales-orchestrator',
  rootDir: '.',
  // roots:[
  //   '.',
  //   '../../shared-utils'
  // ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  // transformIgnorePatterns: [
  //   '/node_modules/(?!shared-utils)',
  // ],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    // '^shared-utils(.*)$': '<rootDir>/../../shared-utils$1',
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
