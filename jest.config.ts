import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    verbose: true,
    projects: ['<rootDir>/src/module/product', '<rootDir>/src/module/sales', '<rootDir>/src/module/online-sales-orchestrator' ]
};

export default config;
