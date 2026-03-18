import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    assetsDir: "static"
  },
  resolve: {
    tsconfigPaths: true
  },
  plugins: [reactPlugin()],
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
