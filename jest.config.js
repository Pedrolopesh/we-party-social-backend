/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.ts", "**/?(*.)+(spec|test).ts"],
  verbose: true,
  forceExit: true,
  moduleFileExtensions: ["ts", "js", "json", "node"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  // clearMocks: true,
  // collectCoverage: true,
  // collectCoverageFrom: ["src/**/*.ts"],
  // coveragePathIgnorePatterns: ["node_modules", ".mock.ts", ".d.ts"],
  // coverageDirectory: "",
  // testPathIgnorePatterns: ["./dist/*", "./__tests__/__mocks__", ".mock.ts"],
  // setupFiles: [""],
};
