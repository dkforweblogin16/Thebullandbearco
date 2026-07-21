// FILE PATH: app/admin/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { useElevatedAccess } from "@/components/admin/ElevatedAccessGate";
import {
  ShoppingBag,
  IndianRupee,
  Star,
  Mail,
  PackageX,
  Package,
  Lock,
  ArrowRight,
  Stethoscope,
} from "lucide-react";


function TroubleshootPanel() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/debug");
      setReport(res);
    } catch (e) {
      setReport({ diagnosis: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <Stethoscope size={15} /> Troubleshoot access
        </p>
        <button
          onClick={run}
          disabled={loading}
          className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Run check"}
        </button>
      </div>
      {report && (
        <div className="text-xs text-slate-600 space-y-1 mt-2 bg-slate-50 rounded-lg p-3">
          <p className="font-semibold text-slate-900">{report.diagnosis}</p>
          <pre className="whitespace-pre-wrap break-words text-[11px] text-slate-500 mt-2">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const statusColor = {
  placed: "bg-amber-100 text-amber-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function KpiCard({ icon: Icon, label, value, accent, href }) {
  const content = (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 h-full">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
      >
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1.5">{label}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { elevated, checking, openGate } = useElevatedAccess();

  useEffect(() => {
    adminFetch("/api/admin/dashboard")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl text-slate-900">Dashboard</h1>
        {!checking && !elevated && (
          <button
            onClick={openGate}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg hover:bg-amber-100"
          >
            <Lock size={13} /> Unlock full control (add / edit / delete)
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <TroubleshootPanel />

      {!data ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            <KpiCard
              icon={ShoppingBag}
              label="Orders today"
              value={data.kpis.ordersToday}
              accent="bg-indigo-50 text-indigo-600"
              href="/admin/orders"
            />
            <KpiCard
              icon={IndianRupee}
              label="Revenue today"
              value={`₹${data.kpis.revenueToday.toLocaleString("en-IN")}`}
              accent="bg-emerald-50 text-emerald-600"
              href="/admin/analytics"
            />
            <KpiCard
              icon={Package}
              label="Awaiting fulfilment"
              value={data.kpis.pendingOrders}
              accent="bg-amber-50 text-amber-600"
              href="/admin/orders"
            />
            <KpiCard
              icon={Star}
              label="Reviews to approve"
              value={data.kpis.pendingReviews}
              accent="bg-violet-50 text-violet-600"
              href="/admin/reviews"
            />
            <KpiCard
              icon={Mail}
              label="Unread messages"
              value={data.kpis.unreadMessages}
              accent="bg-sky-50 text-sky-600"
              href="/admin/messages"
            />
            <KpiCard
              icon={PackageX}
              label="Low stock items"
              value={data.kpis.lowStockCount}
              accent="bg-red-50 text-red-600"
              href="/admin/products"
            />
            <KpiCard
              icon={Package}
              label="Active products"
              value={`${data.kpis.activeProducts}/${data.kpis.totalProducts}`}
              accent="bg-slate-100 text-slate-600"
              href="/admin/products"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-900">Recent orders</p>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {data.recentOrders.length === 0 ? (
                <p className="text-slate-500 text-sm">No orders yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {data.recentOrders.map((o) => (
                    <div key={o.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {o.order_number}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{o.customer}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-semibold text-slate-900">₹{o.total}</span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                            statusColor[o.order_status] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {o.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-900 mb-3">Low stock</p>
              {data.lowStock.length === 0 ? (
                <p className="text-slate-500 text-sm">Everything is well stocked.</p>
              ) : (
                <div className="space-y-2.5">
                  {data.lowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-2">
                      <p className="text-sm text-slate-700 truncate">{p.name}</p>
                      <span
                        className={`text-xs font-semibold shrink-0 ${
                          p.totalStock === 0 ? "text-red-600" : "text-amber-600"
                        }`}
                      >
                        {p.totalStock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
