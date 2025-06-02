/** @type {import("jest").Config} **/


export default {
  // preset: 'ts-jest/presets/default-esm',
  testEnvironment: "node",
  // extensionsToTreatAsEsm: ['.ts'],
  // globals: {
  //   'ts-jest': {
  //     useESM: true,
  //   },
  // },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    // ...tsJestTransformCfg,
  },
    transformIgnorePatterns: ['node_modules'],
};