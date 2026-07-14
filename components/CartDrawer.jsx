"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/store/useCart";

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQty, removeItem, totalPrice } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/50 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-[88%] max-w-sm bg-paper z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-line shrink-0">
              <h2 className="font-display font-bold text-lg">
                Your Bag ({items.length})
              </h2>
              <button onClick={closeCart} className="p-2 -mr-2">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-graphite gap-2">
                  <p className="font-display text-lg text-ink">Your bag is flat.</p>
                  <p className="text-sm">No open positions here yet — go add something.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-3 py-4 border-b border-line"
                  >
                    <div className="relative w-20 h-24 bg-mist shrink-0 overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-graphite mt-0.5">Size: {item.size}</p>
                      <p className="tabular font-semibold mt-1 text-ink">₹{item.price}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-line">
                          <button
                            onClick={() =>
                              updateQty(item.id, item.size, item.qty - 1)
                            }
                            className="p-1.5"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm">{item.qty}</span>
                          <button
                            onClick={() =>
                              updateQty(item.id, item.size, item.qty + 1)
                            }
                            className="p-1.5"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="p-1.5 text-graphite active:text-red"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-line shrink-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-graphite text-sm">Subtotal</span>
                  <span className="tabular font-bold text-lg text-ink">
                    ₹{totalPrice()}
                  </span>
                </div>
                <button className="w-full bg-ink text-paper py-4 font-semibold tracking-wide active:scale-[0.98] transition-transform">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
