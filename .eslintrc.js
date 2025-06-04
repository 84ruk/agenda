// .eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: "detect" },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "next/core-web-vitals",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
};
