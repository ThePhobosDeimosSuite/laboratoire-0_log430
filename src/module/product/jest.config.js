const config = {
    displayName: 'product',
    rootDir: '.',
    setupFiles: ['<rootDir>/jest.setup.js'],
    transform: {
        "^.+\\.ts?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};
export default config;
