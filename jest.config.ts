import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  coverageReporters: [
    "clover",
    "json",
    "lcov",
    [
      "text",
      {
        skipFull: true,
      },
    ],
  ],
  testEnvironment: "node",
};

export default config;
