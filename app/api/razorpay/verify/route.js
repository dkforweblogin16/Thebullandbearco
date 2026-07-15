// FILE PATH: app/api/razorpay/verify/route.js
import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload } = body;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Razorpay is not configured on the server" }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const orderNumber = `BB${Math.floor(100000 + Math.random() * 900000)}`;

  if (!isAdminConfigured) {
    // Payment is genuinely verified even without a database connected —
    // tell the caller so it can still show a real confirmation.
    return NextResponse.json({ orderNumber, demo: true });
  }

  const { error } = await supabaseAdmin.from("orders").insert({
    order_number: orderNumber,
    user_id: orderPayload.userId || null,
    guest_phone: orderPayload.guestPhone || null,
    address: orderPayload.address,
    items: orderPayload.items,
    subtotal: orderPayload.subtotal,
    shipping_fee: orderPayload.shippingFee,
    discount: orderPayload.discount,
    total: orderPayload.total,
    coupon_code: orderPayload.couponCode || null,
    payment_method: "razorpay",
    payment_status: "paid",
    razorpay_order_id,
    razorpay_payment_id,
    order_status: "confirmed",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orderNumber, demo: false });
}

