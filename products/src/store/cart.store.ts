import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductDto } from "../api/productService";

export interface CartItem extends ProductDto {
  quantity: number;
}

export interface CartStore {
  items:          CartItem[];
  addToCart:      (product: ProductDto) => void;
  removeFromCart: (productId: string) => void;
  increaseQty:    (productId: string) => void;
  decreaseQty:    (productId: string) => void;
  clearCart:      () => void;
  totalItems:     () => number;
  totalPrice:     () => number;
}

export const useCartStore = create<CartStore>()(
  persist(                   
    (set, get) => ({
      items: [],

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

      removeFromCart: (productId) =>
        set({ items: get().items.filter((i) => i.id !== productId) }),

      increaseQty: (productId) =>
        set({
          items: get().items.map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }),

      decreaseQty: (productId) =>
        set({
          items: get().items
            .map((i) => i.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
            .filter((i) => i.quantity > 0),
        }),

      clearCart:  () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" } 
  )
);