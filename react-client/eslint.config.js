// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import styleEslint from "@stylistic/eslint-plugin";
// import react from 'eslint-plugin-react'; //? Disabled until it finishes ESLint 9 migration

// ?: tsEslint provides an awesome tool `config(...configObjs[])` for setting up a config with type hinting!
// ?: Especially compared to the standard Eslint 9 `export default []` syntax
export default tsEslint.config(
  // { //? Eslint-plugin-react currently doesn't play nice with typescript-eslint's Flat Config type def
  //   //? SO instead, just being completely explicit about the React plugin's recommended and JSX-runtime config
  //   files: ['**/*.tsx'],
  //   languageOptions: {
  //     parserOptions: {
  //       ecmaFeatures: {
  //         jsx: true
  //       }
  //     }
  //   },
  //   plugins: {
  //     react
  //   },
  //   settings: {
  //     react: { version: "detect" }
  //   },
  //   rules: { //? All the rules in Eslint-plugin-react's recommended + 2 overrides from its JSX-runtime config
  //     'react/display-name': "error",
  //     'react/jsx-key': "error",
  //     'react/jsx-no-comment-textnodes': "error",
  //     'react/jsx-no-duplicate-props': "error",
  //     'react/jsx-no-target-blank': "error",
  //     'react/jsx-no-undef': "error",
  //     'react/jsx-uses-react': "off", //? Normally an error in the Plugin's recommended config, not in the JSX-runtime config
  //     'react/jsx-uses-vars': "error",
  //     'react/no-children-prop': "error",
  //     'react/no-danger-with-children': "error",
  //     'react/no-deprecated': "error",
  //     'react/no-direct-mutation-state': "error",
  //     'react/no-find-dom-node': "error",
  //     'react/no-is-mounted': "error",
  //     'react/no-render-return-value': "error",
  //     'react/no-string-refs': "error",
  //     "react/no-unescaped-entities": ["error", { "forbid": [{ char: ">", alternatives: ["&gt;"] }, { char: "}", alternatives: ["&#125;"] }] }],
  //     'react/no-unknown-property': "error",
  //     'react/no-unsafe': "off",
  //     'react/prop-types': "error",
  //     'react/react-in-jsx-scope': "off", //? Normally an error in the Plugin's recommended config, not in the JSX-runtime config
  //     'react/require-render-return': "error",
  //   },
  // },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
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