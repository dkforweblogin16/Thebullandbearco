// FILE PATH: app/admin/orders/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Search, Download, X } from "lucide-react";

const statusOptions = ["placed", "shipped", "delivered", "cancelled"];
const statusColor = {
  placed: "bg-gold/20 text-ink",
  shipped: "bg-violet/15 text-violet",
  delivered: "bg-green/15 text-green",
  cancelled: "bg-red/15 text-red",
};

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  function load() {
    setLoading(true);
    adminFetch("/api/admin/orders")
      .then((res) => setOrders(res.orders))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.order_status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${o.order_number} ${o.address?.full_name || ""} ${
          o.address?.phone || o.guest_phone || ""
        }`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  const counts = useMemo(() => {
    const c = { all: orders.length };
    statusOptions.forEach((s) => (c[s] = orders.filter((o) => o.order_status === s).length));
    return c;
  }, [orders]);

  async function updateStatus(order, patch) {
    try {
      await adminFetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      load();
      if (selectedOrder?.id === order.id) {
        setSelectedOrder({ ...selectedOrder, ...patch });
      }
    } catch (e) {
      setError(e.message);
    }
  }

  function exportCsv() {
    const rows = filtered.map((o) => ({
      order_number: o.order_number,
      name: o.address?.full_name,
      phone: o.address?.phone || o.guest_phone,
      city: o.address?.city,
      total: o.total,
      payment_method: o.payment_method,
      payment_status: o.payment_status,
      order_status: o.order_status,
      created_at: o.created_at,
    }));
    downloadCsv("orders.csv", toCsv(rows));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="font-display font-bold text-2xl text-ink">Orders</h1>
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 border border-line px-3 py-2.5 rounded-lg text-sm font-semibold text-ink"
        >
          <Download size={15} /> Export
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              statusFilter === s ? "bg-ink text-paper border-ink" : "border-line text-graphite"
            }`}
          >
            {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border border-line rounded-lg px-3 py-2 bg-paper mb-4">
        <Search size={15} className="text-graphite" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, name, or phone..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-graphite text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-graphite text-sm">No orders match.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedOrder(o)}
              className="w-full text-left bg-paper border border-line rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap"
            >
              <div>
                <p className="font-semibold text-ink">{o.order_number}</p>
                <p className="text-xs text-graphite">
                  {o.address?.full_name} · {o.address?.phone || o.guest_phone}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink">₹{o.total}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor[o.order_status] || ""}`}>
                  {o.order_status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-ink/40 flex items-end md:items-center justify-center z-50 p-0 md:p-6">
          <div className="bg-paper w-full md:max-w-lg md:rounded-2xl rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-ink">{selectedOrder.order_number}</h2>
              <button onClick={() => setSelectedOrder(null)}>
                <X size={20} className="text-graphite" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-graphite mb-1">Shipping Address</p>
                <p className="text-ink">{selectedOrder.address?.full_name}</p>
                <p className="text-graphite">
                  {selectedOrder.address?.line1}, {selectedOrder.address?.city},{" "}
                  {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                </p>
                <p className="text-graphite">{selectedOrder.address?.phone || selectedOrder.guest_phone}</p>
              </div>

              <div className="border-t border-line pt-3">
                <p className="text-xs font-semibold text-graphite mb-1">Items</p>
                {(selectedOrder.items || []).map((item, i) => (
                  <p key={i} className="text-graphite">
                    {item.qty}× {item.name} {item.size ? `(${item.size})` : ""} — ₹{item.price}
                  </p>
                ))}
              </div>

              <div className="border-t border-line pt-3 grid grid-cols-2 gap-y-1">
                <span className="text-graphite">Subtotal</span>
                <span className="text-right text-ink">₹{selectedOrder.subtotal}</span>
                <span className="text-graphite">Discount</span>
                <span className="text-right text-ink">-₹{selectedOrder.discount}</span>
                <span className="text-graphite">Shipping</span>
                <span className="text-right text-ink">₹{selectedOrder.shipping_fee}</span>
                <span className="font-semibold text-ink">Total</span>
                <span className="text-right font-bold text-ink">₹{selectedOrder.total}</span>
              </div>

              <div className="border-t border-line pt-3">
                <label className="text-xs font-semibold text-graphite">Order Status</label>
                <select
                  value={selectedOrder.order_status}
                  onChange={(e) => updateStatus(selectedOrder, { order_status: e.target.value })}
                  className="w-full border border-line rounded-lg px-3 py-2 text-sm mt-1"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label className="text-xs font-semibold text-graphite mt-3 block">Payment Status</label>
                <select
                  value={selectedOrder.payment_status}
                  onChange={(e) => updateStatus(selectedOrder, { payment_status: e.target.value })}
                  className="w-full border border-line rounded-lg px-3 py-2 text-sm mt-1"
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="failed">failed</option>
                  <option value="refunded">refunded</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
