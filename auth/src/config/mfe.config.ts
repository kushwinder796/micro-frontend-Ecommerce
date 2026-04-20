
export const API_URL = "https://localhost:7227/api";

//  Micro-frontend ports
export const MFE_PORTS = {
  shell:    3000,
  auth:     3001,
  products: 3003,
  cart:     3004,
} as const;

//  Remote URLs (for shell vite.config.ts)
export const REMOTE_URLS = {
  authApp:     `http://localhost:${MFE_PORTS.auth}/assets/remoteEntry.js`,
  productsApp: `http://localhost:${MFE_PORTS.products}/assets/remoteEntry.js`,
  cartApp:     `http://localhost:${MFE_PORTS.cart}/assets/remoteEntry.js`,
} as const;