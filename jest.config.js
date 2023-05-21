module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  coverageReporters: ['json-summary', 'text'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
};