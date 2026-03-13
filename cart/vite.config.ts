import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "cartApp",
      filename: "remoteEntry.js",
      exposes: { "./CartApp": "./src/App" },
      shared: ["react", "react-dom", "react-router-dom", "zustand", "react-hot-toast"],
    }),
  ],
  server:  { port: 3004, strictPort: true, cors: true },
  preview: { port: 3004, cors: true },
  base: "/",
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});