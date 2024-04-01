import { defineConfig } from "vitest/config";
import reactPlugin from "@vitejs/plugin-react";

export default defineConfig({
  base: "",
  plugins: [ reactPlugin() ],
  test: {
    include: ["./**/*.test.tsx", "./**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    css: { modules: { classNameStrategy: "non-scoped" } },
    setupFiles: "./src/setupTests.ts"
  },
})
