

export const MFE = {
  shell:    import.meta.env.VITE_SHELL_URL    ?? "http://localhost:3000",
  auth:     import.meta.env.VITE_AUTH_URL     ?? "http://localhost:3001",
  cart:     import.meta.env.VITE_CART_URL     ?? "http://localhost:3004",
   products: import.meta.env.VITE_PRODUCTS_URL ?? "http://localhost:3003",
} as const;

export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://localhost:7227";

export function goTo(app: keyof typeof MFE, path = "") {
  window.location.href = `${MFE[app]}${path}`;
}