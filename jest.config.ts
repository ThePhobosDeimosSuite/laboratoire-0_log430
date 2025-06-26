import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    verbose: true,
    projects: ['<rootDir>/src/module/product', '<rootDir>/src/module/sales' ]
};

export default config;
