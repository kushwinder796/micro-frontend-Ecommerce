import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "paymentApp",
      filename: "remoteEntry.js",
      exposes: {
        "./PaymentApp": "./src/PaymentApp.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "zustand"],
    }),
  ],
  server: {
    port: 3005,      
    strictPort: true
  },
  preview: { port: 3005 },
  build:   { target: "esnext" },
});