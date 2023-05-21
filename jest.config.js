module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  coverageReporters: ['json', 'text'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
};