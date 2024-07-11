/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.ts"],
  verbose: true,
  forceExit: true,
  // clearMocks: true,
  // collectCoverage: true,
  // collectCoverageFrom: ["src/**/*.ts"],
  // coveragePathIgnorePatterns: ["node_modules", ".mock.ts", ".d.ts"],
  // coverageDirectory: "",
  // testPathIgnorePatterns: ["./dist/*", "./__tests__/__mocks__", ".mock.ts"],
  // setupFiles: [""],
};
