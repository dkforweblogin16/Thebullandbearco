"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }) {
  const pathname = usePathname();

  // Reserve space at the bottom only on pages that actually have a fixed
  // bottom bar sitting over the content:
  // - "/"                → BottomNav (Home/Category/New/Account)
  // - "/product/..."      → its own Add to Cart bar
  // - "/collection/..."   → its own Sort/Filter bar
  const hasFixedBottomBar =
    pathname === "/" ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/collection/");

  return (
    <main className={hasFixedBottomBar ? "pb-20" : "pb-0"}>{children}</main>
  );
}

