/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/__tests__/**',
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jest-environment-node",
  testMatch: [
    "**/__test__/**/*.js",
  ],
  // transform: {},
  modulePaths: ['src'],
  moduleFileExtensions: [
    "js"
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
