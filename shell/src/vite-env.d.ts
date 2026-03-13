
export interface ImportMetaEnv {
  readonly VITE_SHELL_URL: string;
  readonly VITE_AUTH_URL: string;
  readonly VITE_HOME_URL: string;
  readonly VITE_CART_URL: string;
  readonly VITE_PAYMENT_URL: string;
  readonly VITE_PRODUCTS_URL: string;
  readonly VITE_API_URL: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}