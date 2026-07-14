import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, size) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.id === product.id && i.size === size
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id && i.size === size
                ? { ...i, qty: i.qty + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.images?.[0],
                size,
                qty: 1,
              },
            ],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.size === size)
          ),
        });
      },

      updateQty: (id, size, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map((i) =>
            i.id === id && i.size === size ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "bull-bear-cart" }
  )
);
