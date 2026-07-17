// FILE PATH: app/admin/analytics/page.jsx
"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// NOTE: this page uses the "recharts" library. If it isn't installed
// yet, run:  npm install recharts
// (see the setup notes for why this one extra step is needed).

const statusColors = {
  placed: "#F2A900",
  shipped: "#6D28D9",
  delivered: "#1FA34B",
  cancelled: "#E63946",
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/analytics")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Analytics</h1>
      {error && <p className="text-red text-sm mb-4">{error}</p>}
      {!data ? (
        <p className="text-graphite text-sm">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-paper border border-line rounded-xl p-4">
            <p className="text-sm font-semibold text-ink mb-3">Revenue — last 30 days (paid orders)</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.revenueByDay}>
                <CartesianGrid stroke="#E6E6E2" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(d) => d.slice(5)}
                  interval={4}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [`₹${v}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#1D2B53" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-paper border border-line rounded-xl p-4">
              <p className="text-sm font-semibold text-ink mb-3">Orders by Status (30 days)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.ordersByStatus}>
                  <CartesianGrid stroke="#E6E6E2" strokeDasharray="3 3" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.ordersByStatus.map((entry, i) => (
                      <Cell key={i} fill={statusColors[entry.status] || "#6B6B68"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-paper border border-line rounded-xl p-4">
              <p className="text-sm font-semibold text-ink mb-3">Top 5 Products (units sold, 30 days)</p>
              {data.topProducts.length === 0 ? (
                <p className="text-graphite text-sm">No sales yet in this period.</p>
              ) : (
                <div className="space-y-2">
                  {data.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-graphite w-4">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm text-ink">{p.name}</p>
                        <div className="h-1.5 bg-mist rounded-full mt-1">
                          <div
                            className="h-1.5 bg-ink rounded-full"
                            style={{
                              width: `${(p.units / data.topProducts[0].units) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-ink">{p.units}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

