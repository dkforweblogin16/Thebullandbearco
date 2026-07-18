// FILE PATH: app/admin/layout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Star,
  Mail,
  BarChart3,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Team", href: "/admin/team", icon: Users },
];

function AdminShell({ children }) {
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-mist flex flex-col md:flex-row">
      <aside className="md:w-56 bg-ink text-paper flex md:flex-col shrink-0">
        <div className="px-4 py-4 hidden md:block">
          <p className="font-display font-bold text-lg">Bull &amp; Bear</p>
          <p className="text-paper/50 text-xs">Admin Dashboard</p>
        </div>
        <nav className="flex md:flex-col flex-1 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap ${
                  active ? "bg-paper/10 font-semibold" : "text-paper/70"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => supabase.auth.signOut()}
          className="hidden md:flex items-center gap-2 px-4 py-3 text-sm text-paper/70 mt-auto"
        >
          <LogOut size={16} /> Log Out
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <p className="text-xs text-graphite mb-4">
          Signed in as {profile?.full_name || profile?.email}
        </p>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
