// FILE PATH: app/track-order/page.jsx
"use client";

import { useState } from "react";
import { fetchOrderByNumber } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const statusLabel = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleTrack(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    if (!isSupabaseConfigured) {
      setError("Order tracking needs Supabase connected — see SETUP.md.");
      return;
    }
    setBusy(true);
    const result = await fetchOrderByNumber(orderNumber, phone);
    setBusy(false);
    if (!result) {
      setError("No matching order found. Check your order number and phone number.");
      return;
    }
    setOrder(result);
  }

  return (
    <div className="px-4 pt-10 max-w-sm mx-auto text-center">
      <h1 className="font-display font-bold text-2xl mb-2 text-ink">Track Your Order</h1>
      <p className="text-graphite text-sm mb-6">
        Enter your order number and phone to check its current status.
      </p>
      <form onSubmit={handleTrack} className="space-y-3 text-left">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order Number (e.g. BB482913)"
          className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="Phone Number used at checkout"
          className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink text-paper py-3.5 font-semibold tracking-wide disabled:opacity-60"
        >
          {busy ? "Searching..." : "Track Order"}
        </button>
      </form>

      {error && <p className="text-red text-sm mt-4">{error}</p>}

      {order && (
        <div className="mt-6 border border-line rounded-xl p-4 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm text-ink tabular">{order.order_number}</span>
            <span className="text-xs font-semibold text-green">
              {statusLabel[order.order_status] || order.order_status}
            </span>
          </div>
          <p className="text-xs text-graphite mb-3">
            Placed {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <p className="text-sm text-ink font-bold tabular">₹{order.total}</p>
        </div>
      )}
    </div>
  );
}
