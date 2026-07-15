// FILE PATH: lib/coupons.js
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export async function validateCoupon(code, subtotal) {
  if (!code || !code.trim()) {
    return { valid: false, message: "Enter a coupon code" };
  }
  if (!isSupabaseConfigured) {
    return { valid: false, message: "Coupons need Supabase connected — see SETUP.md" };
  }

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .maybeSingle();

  if (error || !data) return { valid: false, message: "Invalid coupon code" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, message: "This coupon has expired" };
  }
  if (subtotal < Number(data.min_order_value)) {
    return { valid: false, message: `Minimum order value is ₹${data.min_order_value}` };
  }

  const discount =
    data.discount_type === "percent"
      ? Math.round((subtotal * Number(data.discount_value)) / 100)
      : Number(data.discount_value);

  return {
    valid: true,
    discount,
    code: data.code,
    message: `Coupon applied — ₹${discount} off`,
  };
}

