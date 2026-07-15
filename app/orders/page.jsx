// FILE PATH: app/orders/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { fetchOrdersForUser } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const statusLabel = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setFetching(false);
      return;
    }
    fetchOrdersForUser(user.id).then((data) => {
      setOrders(data);
      setFetching(false);
    });
  }, [user, loading]);

  if (loading || fetching) return <div className="min-h-[40vh]" />;

  if (!isSupabaseConfigured) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink mb-2">My Orders</p>
        <p className="text-graphite text-sm">Connect Supabase to start storing real orders.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink mb-3">Log in to see your orders</p>
        <Link href="/account" className="inline-block bg-ink text-paper px-6 py-3 rounded-lg font-semibold text-sm">
          Log In
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink mb-2">No orders yet</p>
        <Link href="/" className="text-ink underline text-sm">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-5">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block border border-line rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-sm text-ink tabular">{order.order_number}</span>
              <span className="text-xs font-semibold text-green">
                {statusLabel[order.order_status] || order.order_status}
              </span>
            </div>
            <p className="text-xs text-graphite mb-2">
              {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-graphite">{order.items?.length || 0} item(s)</span>
              <span className="font-bold text-ink tabular">₹{order.total}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

