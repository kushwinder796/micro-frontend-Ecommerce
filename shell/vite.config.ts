import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "shell",
      remotes: {
        "authApp":       "http://localhost:3001/assets/remoteEntry.js",
        // "homeApp":       "http://localhost:3002/assets/remoteEntry.js",
        "productsApp":   "http://localhost:3003/assets/remoteEntry.js",
        "cartApp":       "http://localhost:3004/assets/remoteEntry.js",
       "paymentApp":     "http://localhost:3005/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "react-router-dom", "zustand","react-hot-toast"]
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    cors:true,
  },
  preview: { port: 3000 ,cors:true},
  base: "/",     
  build: { target: "esnext" ,minify:false,cssCodeSplit:false},
})
