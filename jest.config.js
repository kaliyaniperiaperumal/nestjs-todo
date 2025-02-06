module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  modulePaths: ["<rootDir>"],
  rootDir: "./",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "tsconfig.spec.json" }],
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "interfaces",
    "types",
    "dist",
    "jestGlobalMocks.ts",
    "\\.module\\.ts",
    "\\.entity\\.ts",
    "\\.dto\\.ts",
    "\\main\\.ts",
    "\\.mock\\.ts",
  ],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  preset: "ts-jest",
};
