"use client";

import { Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useUI } from "@/store/useUI";
import { useCart } from "@/store/useCart";

export default function Header() {
  const { toggleMenu, openSearch } = useUI();
  const totalItems = useCart((s) => s.totalItems());
  const openCart = useCart((s) => s.openCart);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="flex items-center justify-between px-4 h-16">
        <button
          aria-label="Open menu"
          onClick={toggleMenu}
          className="p-2 -ml-2 active:scale-90 transition-transform text-ink"
        >
          <Menu size={24} strokeWidth={1.75} />
        </button>

        <Link
          href="/"
          className="font-display font-bold tracking-tight text-xl text-ink select-none"
        >
          Bull &amp; Bear Co.
        </Link>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            onClick={openSearch}
            className="p-2 active:scale-90 transition-transform text-ink"
          >
            <Search size={22} strokeWidth={1.75} />
          </button>
          <button
            aria-label="Open cart"
            onClick={openCart}
            className="p-2 -mr-2 relative active:scale-90 transition-transform text-ink"
          >
            <ShoppingBag size={22} strokeWidth={1.75} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
