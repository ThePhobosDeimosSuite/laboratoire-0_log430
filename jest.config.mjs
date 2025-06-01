// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;
// import { createDefaultEsmPreset } from 'ts-jest'
// import type { Config } from 'jest'

/** @type {import("jest").Config} **/


// const presetConfig = createDefaultEsmPreset({
//   //...options
// })

// export default {
//   ...presetConfig,
// } satisfies Config

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: "node",
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transform: {
    // ...tsJestTransformCfg,
  },
};