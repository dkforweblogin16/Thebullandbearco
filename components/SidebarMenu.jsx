// FILE PATH: components/SidebarMenu.jsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, MessageCircle, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useUI } from "@/store/useUI";
import { categories } from "@/lib/data";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useScrollLock } from "@/lib/useScrollLock";

const footerLinks = [
  { label: "My Orders", href: "/orders" },
  { label: "My Wishlist", href: "/wishlist" },
  { label: "Track Order", href: "/track-order" },
  { label: "Reviews", href: "/reviews" },
  { label: "Stores Near Me", href: "/stores" },
  { label: "Return & Exchange", href: "/returns" },
  { label: "Contact Us", href: "/contact" },
];

export default function SidebarMenu() {
  const { menuOpen, closeMenu } = useUI();
  const { user, profile } = useAuth();

  useScrollLock(menuOpen);

  function handleLogout() {
    supabase.auth.signOut();
    closeMenu();
  }

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 h-[100dvh] z-50 bg-paper flex flex-col"
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-line shrink-0">
            <button
              aria-label="Close menu"
              onClick={closeMenu}
              className="p-2 -ml-2 text-ink"
            >
              <X size={24} />
            </button>
            <span className="font-display font-bold tracking-tight text-lg text-ink">
              Bull &amp; Bear Co.
            </span>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {user && (
              <Link
                href="/account"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-4 border-b border-line"
              >
                <span className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
                  <User size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    Hi, {profile?.full_name || "there"}
                  </p>
                  <p className="text-xs text-graphite truncate">
                    {profile?.email || user.email}
                  </p>
                </div>
              </Link>
            )}

            <nav className="px-4">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collection/${c.slug}`}
                  onClick={closeMenu}
                  className="block py-4 border-b border-line text-2xl font-display font-medium text-ink active:opacity-60 transition-opacity"
                >
                  {c.label}
                </Link>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-x-4 px-4 py-6 text-sm text-graphite">
              {footerLinks.map((f) => (
                <Link
                  key={f.label}
                  href={f.href}
                  onClick={closeMenu}
                  className="py-2"
                >
                  {f.label}
                </Link>
              ))}
              <Link href="/support" onClick={closeMenu} className="py-2 flex items-center gap-1.5 text-green font-medium">
                <MessageCircle size={16} /> Support
              </Link>
            </div>
          </div>

          <div className="p-4 shrink-0 border-t border-line">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-4 font-semibold tracking-wide"
              >
                <LogOut size={16} /> Log Out
              </button>
            ) : (
              <Link
                href="/account"
                onClick={closeMenu}
                className="block w-full text-center bg-ink text-paper py-4 font-semibold tracking-wide"
              >
                Log In or Sign Up
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
