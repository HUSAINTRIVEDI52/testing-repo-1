/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  // moduleNameMapper: {
  //   "\\.(css|scss)$": "identity-obj-proxy",
  // },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.scss$": "jest-css-modules-transform",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
