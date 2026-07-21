// FILE PATH: app/api/admin/dashboard/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabaseAdmin";

// Single read-only summary call for the Dashboard home page, so it
// doesn't need to fire off half a dozen separate requests. Any
// signed-in admin can view this (no elevated passcode needed — it's
// read-only).
export async function GET(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  if (!isAdminConfigured) {
    return NextResponse.json({ message: "Supabase not configured" }, { status: 500 });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [ordersRes, productsRes, reviewsRes, messagesRes] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("id, order_number, total, payment_status, order_status, address, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabaseAdmin
      .from("products")
      .select("id, name, stock, is_active"),
    supabaseAdmin
      .from("reviews")
      .select("id, is_approved"),
    supabaseAdmin
      .from("contact_messages")
      .select("id, is_read"),
  ]);

  if (ordersRes.error) return NextResponse.json({ message: ordersRes.error.message }, { status: 500 });
  if (productsRes.error) return NextResponse.json({ message: productsRes.error.message }, { status: 500 });
  if (reviewsRes.error) return NextResponse.json({ message: reviewsRes.error.message }, { status: 500 });
  if (messagesRes.error) return NextResponse.json({ message: messagesRes.error.message }, { status: 500 });

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];
  const reviews = reviewsRes.data || [];
  const messages = messagesRes.data || [];

  const ordersToday = orders.filter((o) => new Date(o.created_at) >= startOfToday);
  const revenueToday = ordersToday
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.order_status === "placed").length;
  const pendingReviews = reviews.filter((r) => !r.is_approved).length;
  const unreadMessages = messages.filter((m) => !m.is_read).length;

  const lowStock = products
    .filter((p) => p.is_active)
    .map((p) => ({
      id: p.id,
      name: p.name,
      totalStock: Object.values(p.stock || {}).reduce((s, n) => s + Number(n || 0), 0),
    }))
    .filter((p) => p.totalStock <= 5)
    .sort((a, b) => a.totalStock - b.totalStock)
    .slice(0, 8);

  const recentOrders = orders.slice(0, 6).map((o) => ({
    id: o.id,
    order_number: o.order_number,
    customer: o.address?.full_name || "—",
    total: o.total,
    payment_status: o.payment_status,
    order_status: o.order_status,
    created_at: o.created_at,
  }));

  return NextResponse.json({
    kpis: {
      ordersToday: ordersToday.length,
      revenueToday,
      pendingOrders,
      pendingReviews,
      unreadMessages,
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.is_active).length,
      lowStockCount: lowStock.length,
    },
    recentOrders,
    lowStock,
  });
}

