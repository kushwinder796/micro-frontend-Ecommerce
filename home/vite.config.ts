import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "homeApp",
      filename: "remoteEntry.js",
      exposes: {
        "./HomeApp": "./src/HomeApp.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "zustand"],
    }),
  ],
  server: {
    port: 3002,      
    strictPort: true
  },
  preview: { port: 3002 },
  build:   { target: "esnext" },
});