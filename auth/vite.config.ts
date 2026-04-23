import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "authApp",
      filename: "remoteEntry.js",
      exposes: { "./AuthApp": "./src/App" },
      shared: {
        react:              { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom":        { singleton: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
        zustand:            { singleton: true, requiredVersion: "^5.0.0" },
        "react-hot-toast":  { singleton: true, requiredVersion: "^2.0.0" },
      },
    }),
    react(),
    tailwindcss(),
  ],
  server:  { port: 3001, strictPort: true, cors: true },
  preview: { port: 3001, cors: true },
  base: "/",
  build: { target: "esnext", minify: false, cssCodeSplit: false },
});
