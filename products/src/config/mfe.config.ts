export const API_URL = "https://localhost:7227/api";

//  Micro-frontend ports
export const MFE_PORTS = {
  shell:    3000,
  auth:     3001,
  home:     3002,
  products: 3003,
  cart:     3004,
  payment:  3005,
} as const;

//  Remote URLs (for shell vite.config.ts)
export const REMOTE_URLS = {
  authApp:     `http://localhost:${MFE_PORTS.auth}/assets/remoteEntry.js`,
  homeApp:     `http://localhost:${MFE_PORTS.home}/assets/remoteEntry.js`,
  productsApp: `http://localhost:${MFE_PORTS.products}/assets/remoteEntry.js`,
  cartApp:     `http://localhost:${MFE_PORTS.cart}/assets/remoteEntry.js`,
  paymentApp:  `http://localhost:${MFE_PORTS.payment}/assets/remoteEntry.js`,
} as const;