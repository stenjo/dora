/* eslint-disable filenames/match-regex */
import type {Config} from 'jest'

export default async (): Promise<Config> => {
  return {
    verbose: false,
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['**/*.test.ts'],
    coverageReporters: ['json-summary', 'text', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    }
  }
}
