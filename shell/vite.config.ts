import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    federation({
      name: "shell",
      remotes: {
        authApp:     { type: "module", name: "authApp",     entry: "http://localhost:3001/remoteEntry.js" },
        productsApp: { type: "module", name: "productsApp", entry: "http://localhost:3003/remoteEntry.js" },
        cartApp:     { type: "module", name: "cartApp",     entry: "http://localhost:3004/remoteEntry.js" },
      },
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
  server:  { port: 3000, strictPort: true, cors: true, open: true },
  preview: { port: 3000, cors: true },
  base: "/",
  build: { target: "esnext", minify: false, cssCodeSplit: false },
});
