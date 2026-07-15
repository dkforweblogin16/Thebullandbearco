// FILE PATH: app/admin/orders/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const statuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, order_status) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, order_status }),
    });
    loadOrders();
  }

  if (unauthorized) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink mb-3">Not logged in</p>
        <Link href="/admin" className="text-ink underline text-sm">Go to admin login</Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-10">
      <h1 className="font-display font-bold text-xl text-ink mb-5">Orders</h1>

      {loading ? (
        <p className="text-sm text-graphite">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-graphite">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border border-line rounded-xl p-4">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-ink tabular">{o.order_number}</span>
                <span className="text-xs font-bold text-ink tabular">₹{o.total}</span>
              </div>
              <p className="text-xs text-graphite mb-1">
                {o.address?.fullName} · {o.address?.phone}
              </p>
              <p className="text-xs text-graphite mb-3">
                {o.payment_method === "cod" ? "Cash on Delivery" : "Paid via Razorpay"} ·{" "}
                {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
              <select
                value={o.order_status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm outline-none bg-paper"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

