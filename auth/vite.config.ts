import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "authApp",
      filename: "remoteEntry.js",
      exposes: {
        "./AuthApp": "./src/App",
      },
      shared: ["react", "react-dom", "react-router-dom", "zustand", "react-hot-toast"],
    }),
  ],
  server: {
    port: 3001,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3001,
    cors: true,
  },
  base: "/",
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});