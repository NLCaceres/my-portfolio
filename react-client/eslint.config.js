// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import styleEslint from "@stylistic/eslint-plugin";
import reactEslint from "eslint-plugin-react";

// ?: tsEslint provides an awesome tool `config(...configObjs[])` for setting up a config with type hinting!
// ?: Especially compared to the standard Eslint 9 `export default []` syntax
export default tsEslint.config(
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [ // ?: ESLint returns an obj, so no spread needed. ts-eslint returns an array, so it must be spread
      eslint.configs.recommended, ...tsEslint.configs.recommended
    ],
    languageOptions: { // ?: A LOT of properties from ".eslintrc" (like `parser`) have been placed in `languageOptions`
      ecmaVersion: 2022,
      globals: { // ?: Env from ".eslintrc" was generally replaced by `languageOptions.globals`
        ...globals.browser,
        ...globals.node,
      },
      parser: tsEslint.parser,
      sourceType: "module",
    },
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
      stylistic: styleEslint
    },
    rules: {
      "stylistic/linebreak-style": ["error", "unix"],
      "stylistic/no-trailing-spaces": "error",
      "stylistic/indent": ["error", 2],
      "stylistic/quotes": "error",
      "stylistic/semi": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }]
    }
  },
  {
    files: ["src/**/*.tsx"], // ?: ReactESLint like ESLint just returns an obj, so no spread needed
    extends: [reactEslint.configs.flat.recommended, reactEslint.configs.flat["jsx-runtime"]],
    settings: { react: { version: "detect" } },
    rules: {
      "stylistic/indent": "off",
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", "first"],
      "react/no-unescaped-entities": ["error", {
        "forbid": [{ char: ">", alternatives: ["&gt;"] }, { char: "}", alternatives: ["&#125;"] }]
      }]
    }
  },
  { // ?: Adding a separate config object is the equivalent of "overrides" from ".eslintrc" files
    files: ['src/**/*.test.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      "react/display-name": "off",
      "@typescript-eslint/no-non-null-assertion": "off"
    }
  }
)