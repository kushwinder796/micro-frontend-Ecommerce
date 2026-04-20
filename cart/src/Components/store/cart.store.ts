
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  categoryId: number;
  imageUrl?: string;
}

 export type  cartstoreInstance=ReturnType<typeof createStore>;
 declare global {
  interface Window {
    __cartStore: cartstoreInstance;
  }
}

export interface CartItem extends ProductDto {
  quantity: number;
}

 export interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  addToCart: (product: ProductDto) => void;
  removeFromCart: (productId: string) => void;
  increaseQty: (productId: string) => void;
  decreaseQty: (productId: string) => void;
  clearCart: (silent?: boolean) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const createStore = () =>
  create<CartStore>()(
    persist(
      (set, get) => ({
        items: [],
        hasHydrated: false,
        setHasHydrated: (v) => set({ hasHydrated: v }),

        addToCart: (product) => {
          const existing = get().items.find((i) => i.id === product.id);
          if (existing) {
            set({
              items: get().items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            });
          } else {
            set({ items: [...get().items, { ...product, quantity: 1 }] });
          }
        },

        removeFromCart: (id) =>
          set({ items: get().items.filter((i) => i.id !== id) }),

        increaseQty: (id) =>
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }),

        decreaseQty: (id) =>
          set({
            items: get()
              .items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity - 1 } : i
              )
              .filter((i) => i.quantity > 0),
          }),

        clearCart: (silent = false) => {
          toast.dismiss();
          set({ items: [] });
          if (!silent) {
            toast.success("Cart cleared successfully");
          }
        },

        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: () =>
          get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      }),
      {
        name: "cart-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
        partialize: (state) => ({ items: state.items }),
      }
    )
  );


if (!window.__cartStore) {

  window.__cartStore = createStore();
}


export const useCartStore = window.__cartStore;