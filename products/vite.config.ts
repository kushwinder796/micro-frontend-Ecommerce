import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "productsApp",
      filename: "remoteEntry.js",
      exposes: { "./ProductsApp": "./src/Components/ProductsApp.tsx" },
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
  server:  { port: 3003, strictPort: true, cors: true },
  preview: { port: 3003, cors: true },
  build: { target: "esnext", minify: false, cssCodeSplit: false },
});
