// FILE PATH: app/api/admin/analytics/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }

  const since = new Date();
  since.setDate(since.getDate() - 29); // last 30 days

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("total, payment_status, order_status, items, created_at")
    .gte("created_at", since.toISOString());

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Revenue per day (last 30 days), paid orders only.
  const dayMap = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    dayMap[d.toISOString().slice(0, 10)] = 0;
  }
  orders
    .filter((o) => o.payment_status === "paid")
    .forEach((o) => {
      const day = o.created_at.slice(0, 10);
      if (day in dayMap) dayMap[day] += Number(o.total || 0);
    });
  const revenueByDay = Object.entries(dayMap).map(([date, revenue]) => ({ date, revenue }));

  // Orders by status.
  const statusCounts = {};
  orders.forEach((o) => {
    statusCounts[o.order_status] = (statusCounts[o.order_status] || 0) + 1;
  });
  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  // Top products by units sold (from items jsonb on each order).
  const productCounts = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      productCounts[item.name] = (productCounts[item.name] || 0) + Number(item.qty || 0);
    });
  });
  const topProducts = Object.entries(productCounts)
    .map(([name, units]) => ({ name, units }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  return NextResponse.json({ revenueByDay, ordersByStatus, topProducts });
}

