import { defineConfig } from "vitest/config";
import reactPlugin from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [reactPlugin()],
  test: {
    include: ["./**/*.test.tsx", "./**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    css: { modules: { classNameStrategy: "non-scoped" } },
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporter: ["text"],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90
      },
      include: ["**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "dist/**",
        "public/**",
        "**/node_modules/**",
        "src/index.tsx",
        "src/serviceWorker.js",
        "src/**/LoggerFuncs.ts",
        "src/**/WarningSilencer.ts"
      ]
    }
  },
});
