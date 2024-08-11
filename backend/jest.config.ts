/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { Config } from "jest";

export const config: Config = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/spec/**/*.spec.ts"],
  testEnvironment: "node",

  verbose: true,
  forceExit: true,
  // clearMocks: true,
};
export default config;