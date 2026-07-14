"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Sparkles, User } from "lucide-react";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Category", href: "/category", icon: LayoutGrid },
  { label: "New", href: "/new", icon: Sparkles, badge: true },
  { label: "Account", href: "/account", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-paper border-t border-line flex justify-around items-center h-16">
      {tabs.map((t) => {
        const active =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href.split("/").slice(0, 2).join("/"));
        const Icon = t.icon;
        return (
          <Link
            key={t.label}
            href={t.href}
            className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium w-16 ${
              active ? "text-ink" : "text-graphite"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
            {t.label}
            {t.badge && (
              <span className="absolute -top-1 right-2 bg-ink text-paper text-[8px] font-bold px-1 rounded-full">
                NEW
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
