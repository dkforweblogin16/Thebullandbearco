// FILE PATH: app/api/razorpay/create-order/route.js
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay is not configured on the server yet — see SETUP.md" },
      { status: 500 }
    );
  }

  const { amount } = await req.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    return NextResponse.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Could not create Razorpay order" }, { status: 500 });
  }
}

