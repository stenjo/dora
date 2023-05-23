module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  coverageReporters: ['lcov','json-summary', 'text'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
};