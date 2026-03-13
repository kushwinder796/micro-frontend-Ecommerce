import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductDto {
  id:          string;
  name:        string;
  price:       number;
  description: string;
  stock:       number;
  categoryId:  number;
  imageUrl?:   string;
}

export interface CartItem extends ProductDto {
  quantity: number;
}

interface CartStore {
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
          items: get().items
            .map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
            .filter((i) => i.quantity > 0),
        }),

      clearCart:  () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);