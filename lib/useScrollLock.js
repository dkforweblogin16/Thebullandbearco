// FILE PATH: lib/useScrollLock.js
"use client";

import { useEffect } from "react";

// Locks background scroll while an overlay (cart drawer, sidebar menu,
// search overlay) is open. Without this, the page behind can still
// scroll/resize, and on mobile the browser's address bar can collapse or
// expand independently — which throws off `fixed` positioned elements and
// lets the underlying page's fixed bars (e.g. Add to Cart / Buy Now) peek
// through below the overlay. Restores the exact scroll position on close.
export function useScrollLock(isOpen) {
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}
