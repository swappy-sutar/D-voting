import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
  },

  resolve: {
    alias: {},
  },
  preview: {
    port: 4173,
  },
  plugins: [vercel()],
});
