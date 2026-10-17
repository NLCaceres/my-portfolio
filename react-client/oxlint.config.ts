import { defineConfig } from "oxlint";

export default defineConfig({
  "ignorePatterns": ["*.config.{js,ts}", "*.d.ts", "serviceWorker.js"],
  "plugins": ["eslint", "typescript"], // Default plugins are ESLint, OXC, Typescript, and Unicorn
  "jsPlugins": ["@stylistic/eslint-plugin"], //TODO Prefer OxFmt BUT stopgap fix
  "categories": {
    "correctness": "error"
  },
  "env": {
    "builtin": true,
    "browser": true,
    "node": true
  },
  "rules": {
    "@stylistic/linebreak-style": ["error", "unix"],
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/indent": ["error", 2],
    "@stylistic/quotes": "error",
    "@stylistic/semi": "error",
  },
  "overrides": [
    {
      "files": ["src/**/*.{ts,tsx}"],
      "rules": { // HAD ~50 of 57 total correctness BUT 14 were off
        "no-case-declarations": "error", // pedantic
        "no-empty": "error", // restrict
        "no-fallthrough": "error", // pedantic
        "no-prototype-builtins": "error", // pedantic - in prog fix
        "no-redeclare": "off", // pedantic - OFF
        "no-regex-spaces": "error", // restrict
        "no-undef": "off", // nursery - OFF
        "no-unexpected-multiline": "error", // sus - dangerous fix
        "no-useless-assignment": "error", // nursery
        "preserve-caught-error": "error", // sus
        "no-var": "error", // restrict
        "prefer-const": "error", // style
        "prefer-rest-params": "error", // style
        "prefer-spread": "error", // style
        "no-array-constructor": "error", // pedantic
        "no-unused-expressions": [ // correct
          "error", { "allowShortCircuit": true, "allowTernary": true }
        ],
        "typescript/ban-ts-comment": "error", //! ONLY missing 2 typescript corrects
        "typescript/consistent-type-definitions": ["error", "type"], // style
        "typescript/no-deprecated": "error", // pedantic
        "typescript/no-empty-object-type": "error", // restrict
        "typescript/no-explicit-any": "error", // restriction
        "typescript/no-misused-promises": "error", // pedantic
        "typescript/no-namespace": "error", // restrict
        "typescript/no-require-imports": "error", // restriction
        "typescript/no-unnecessary-type-assertion": "error", // sus
        "typescript/no-unnecessary-type-constraint": "error", // sus
        "typescript/no-unsafe-argument": "error", // pedantic
        "typescript/no-unsafe-assignment": "error", // pedantic
        "typescript/no-unsafe-call": "error", // pedantic
        "typescript/no-unsafe-declaration-merging": "error", // correct
        "typescript/no-unsafe-enum-comparison": "error", // sus
        "typescript/no-unsafe-function-type": "error", // pedantic
        "typescript/no-unsafe-member-access": "error", // pedantic
        "typescript/no-unsafe-return": "error", // pedantic
        "typescript/only-throw-error": "error", // Pedantic but useful
        "typescript/prefer-promise-reject-errors": "error", // pedantic //? Typed improvement to base version
        "typescript/require-await": "error", // pedantic
        "typescript/restrict-plus-operands": "error", // pedantic
      }
    },
    {
      "files": ["src/**/*.tsx"],
      "plugins": ["react"],
      "jsPlugins": ["@stylistic/eslint-plugin"],
      "rules": {
        "react/display-name": "error", // pedantic
        "react/jsx-key": "error", // correct
        "react/jsx-no-comment-textnodes": "error", // sus
        "react/jsx-no-duplicate-props": "error", // correct
        "react/jsx-no-target-blank": "error", // pedantic
        "react/jsx-no-undef": "error", // correct
        "react/no-children-prop": "error", // correct
        "react/no-danger-with-children": "error", // correct
        "react/no-direct-mutation-state": "error", // correct
        "react/no-find-dom-node": "error", // correct
        "react/no-is-mounted": "error", // correct
        "react/no-render-return-value": "error", // correct
        "react/no-string-refs": "error", // correct
        "react/no-unescaped-entities": "error", // pedantic
        "react/no-unknown-property": "error", // restrict
        "react/no-unsafe": "off", // correct
        "react/react-in-jsx-scope": "off", // sus
        "react/require-render-return": "error", // nursery
        "@stylistic/indent": "off"
      }
    },
    {
      "files": ["src/**/*.test.{ts,tsx}"],
      "plugins": ["typescript"],
      "env": {
        "jest": true
      },
      "rules": {
        "typescript/no-non-null-assertion": "off", // restrict
        "typescript/no-unsafe-assignment": "off", // pedantic
        "typescript/require-await": "off", // pedantic
      }
    },
    {
      "files": ["src/**/*.test.tsx"],
      "plugins": ["react"],
      "rules": {
        "react/display-name": "off", // pedantic
      }
    }
  ]
})
