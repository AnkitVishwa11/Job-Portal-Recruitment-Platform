module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  setupFilesAfterSetup: [],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 30000,
};


