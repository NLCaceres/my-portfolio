/* eslint-env node */

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module",
  },
  "plugins": [
    "@typescript-eslint",
    "react"
  ],
  "rules": {
    "linebreak-style": ["error", "unix"],
    "no-trailing-spaces": "error",
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "quotes": "off",
    "@typescript-eslint/quotes": "error",
    "semi": "off",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/no-unescaped-entities": ["error", { "forbid": [{ char: ">", alternatives: ["&gt;"] }, { char: "}", alternatives: ["&#125;"] }] }],
  },
  settings: {
    react: { version: "detect" }
  },
  overrides: [
    {
      env: {
        jest: true
      },
      files: ["*.test.tsx"],
      rules: {
        "react/display-name": "off",
        "@typescript-eslint/no-non-null-assertion": "off"
      }
    }
  ],
};
