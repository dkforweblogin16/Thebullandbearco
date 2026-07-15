// FILE PATH: store/useWishlist.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// Always persisted locally so wishlisting works even without Supabase.
// Best-effort mirrors to Supabase when a user is signed in and connected.
export const useWishlist = create(
  persist(
    (set, get) => ({
      ids: [],

      has: (productId) => get().ids.includes(productId),

      toggle: async (productId, userId) => {
        const exists = get().ids.includes(productId);
        set({
          ids: exists
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId],
        });

        if (isSupabaseConfigured && userId) {
          if (exists) {
            await supabase
              .from("wishlists")
              .delete()
              .eq("user_id", userId)
              .eq("product_id", productId);
          } else {
            await supabase
              .from("wishlists")
              .upsert({ user_id: userId, product_id: productId });
          }
        }
      },
    }),
    { name: "bull-bear-wishlist" }
  )
);

