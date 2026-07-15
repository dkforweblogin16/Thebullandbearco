// FILE PATH: lib/orders.js
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export function generateOrderNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `BB${rand}`;
}

// Cash-on-delivery orders can be written straight from the browser because
// the RLS policy on `orders` allows inserts where user_id matches the
// signed-in user OR is null (guest checkout).
export async function createCodOrder(payload) {
  const orderNumber = generateOrderNumber();

  if (!isSupabaseConfigured) {
    return { orderNumber, demo: true };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: payload.userId || null,
      guest_phone: payload.guestPhone || null,
      address: payload.address,
      items: payload.items,
      subtotal: payload.subtotal,
      shipping_fee: payload.shippingFee,
      discount: payload.discount,
      total: payload.total,
      coupon_code: payload.couponCode || null,
      payment_method: "cod",
      payment_status: "pending",
      order_status: "placed",
    })
    .select()
    .single();

  if (error) throw error;
  return { orderNumber: data.order_number, demo: false };
}

export async function fetchOrdersForUser(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function fetchOrderById(id) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return data;
}

// Public lookup for the Track Order page — requires the phone number on the
// order to match, so a stranger can't browse orders by guessing numbers.
export async function fetchOrderByNumber(orderNumber, phone) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber.trim().toUpperCase())
    .maybeSingle();
  if (error || !data) return null;

  const addressPhone = data.address?.phone;
  const last10 = (p) => (p || "").replace(/\D/g, "").slice(-10);
  if (phone && last10(phone) !== last10(addressPhone) && last10(phone) !== last10(data.guest_phone)) {
    return null;
  }
  return data;
}

