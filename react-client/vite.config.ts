import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import viteTSConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "",
  plugins: [reactPlugin(), viteTSConfigPaths()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        secure: false
      }
    }
  }
});