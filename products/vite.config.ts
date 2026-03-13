
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "productsApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsApp": "./src/Components/ProductsApp.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "zustand","react-hot-toast"],
    }),
  ],
  server: {
    port: 3003,
    strictPort: true
  },
  preview: { port: 3003 },
  build: { target: "esnext" },
});