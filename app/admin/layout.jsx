// FILE PATH: app/admin/layout.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import {
  ElevatedAccessProvider,
  ElevationStatusPill,
} from "@/components/admin/ElevatedAccessGate";
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
  Menu,
  X,
  ArrowLeft,
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

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-white/10 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={17} strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminShell({ children }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-body flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col bg-slate-900 text-white shrink-0 sticky top-0 h-screen">
        <SidebarHeader />
        <NavLinks pathname={pathname} />
        <SidebarFooter profile={profile} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4">
              <SidebarBrand />
              <button onClick={() => setDrawerOpen(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            <SidebarFooter profile={profile} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-slate-900 text-white px-4 py-3">
          <button onClick={() => setDrawerOpen(true)} className="text-white">
            <Menu size={22} />
          </button>
          <SidebarBrand compact />
          <ElevationStatusPill />
        </div>

        {/* Desktop topbar */}
        <div className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-3.5">
          <p className="text-sm text-slate-500">
            Signed in as{" "}
            <span className="font-medium text-slate-900">
              {profile?.full_name || profile?.email}
            </span>
          </p>
          <ElevationStatusPill />
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function SidebarBrand({ compact }) {
  return (
    <div>
      <p className={`font-semibold tracking-tight ${compact ? "text-sm" : "text-lg"}`}>
        Bull &amp; Bear
      </p>
      {!compact && <p className="text-slate-400 text-[11px] tracking-wide">Control Center</p>}
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="px-5 py-5 border-b border-white/10">
      <SidebarBrand />
    </div>
  );
}

function SidebarFooter({ profile }) {
  return (
    <div className="border-t border-white/10 p-3 space-y-2">
      <div className="px-2 py-1">
        <p className="text-xs text-slate-400 truncate">
          {profile?.full_name || profile?.email}
        </p>
      </div>
      <Link
        href="/"
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5"
      >
        <ArrowLeft size={16} /> Back to Website
      </Link>
      <button
        onClick={() => supabase.auth.signOut()}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5"
      >
        <LogOut size={16} /> Log Out
      </button>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <ElevatedAccessProvider>
        <AdminShell>{children}</AdminShell>
      </ElevatedAccessProvider>
    </AdminGuard>
  );
}
