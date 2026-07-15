// FILE PATH: app/admin/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ClipboardList, LogOut } from "lucide-react";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [authed, setAuthed] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Wrong passcode");
      return;
    }
    setAuthed(true);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setPasscode("");
  }

  if (!authed) {
    return (
      <div className="px-6 pt-16 max-w-sm mx-auto">
        <h1 className="font-display font-bold text-2xl text-ink text-center mb-1">
          Admin
        </h1>
        <p className="text-graphite text-sm text-center mb-8">
          Enter your admin passcode to manage products and orders.
        </p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Admin passcode"
            className="w-full border border-line rounded-lg px-4 py-3 text-sm outline-none focus:border-ink"
          />
          {error && <p className="text-red text-xs">{error}</p>}
          <button
            disabled={busy}
            className="w-full bg-ink text-paper py-3.5 rounded-lg font-semibold text-sm disabled:opacity-60"
          >
            {busy ? "Checking..." : "Enter"}
          </button>
        </form>
        <p className="text-[11px] text-graphite text-center mt-6 leading-relaxed">
          Set the <code>ADMIN_PASSCODE</code> environment variable in Vercel
          to your own secret before going live.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-10 max-w-sm mx-auto">
      <h1 className="font-display font-bold text-2xl text-ink text-center mb-8">
        Admin Dashboard
      </h1>
      <div className="space-y-3">
        <Link
          href="/admin/products"
          className="flex items-center gap-3 border border-line rounded-xl p-4"
        >
          <Package size={20} className="text-ink" />
          <div>
            <p className="font-semibold text-sm text-ink">Products</p>
            <p className="text-xs text-graphite">Add, edit, and retire items</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 border border-line rounded-xl p-4"
        >
          <ClipboardList size={20} className="text-ink" />
          <div>
            <p className="font-semibold text-sm text-ink">Orders</p>
            <p className="text-xs text-graphite">View and update order status</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red text-sm font-medium mt-4 mx-auto"
        >
          <LogOut size={14} /> Log Out of Admin
        </button>
      </div>
    </div>
  );
}

