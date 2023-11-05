module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  coverageReporters: ['json-summary', 'text', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
};