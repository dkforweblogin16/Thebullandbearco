// FILE PATH: app/checkout/page.jsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/components/AuthProvider";
import { createCodOrder } from "@/lib/orders";
import { validateCoupon } from "@/lib/coupons";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const subtotal = totalPrice();
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const discount = coupon?.valid ? coupon.discount : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const addressComplete =
    address.fullName && address.phone.length === 10 && address.line1 && address.city && address.state && address.pincode.length === 6;

  async function applyCoupon() {
    const result = await validateCoupon(couponInput, subtotal);
    setCouponMsg(result.message);
    setCoupon(result.valid ? result : null);
  }

  function buildOrderPayload() {
    return {
      userId: user?.id || null,
      guestPhone: address.phone,
      address,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        size: i.size,
        qty: i.qty,
        image: i.image,
      })),
      subtotal,
      shippingFee,
      discount,
      total,
      couponCode: coupon?.code || null,
    };
  }

  async function placeOrder() {
    setError("");
    if (!addressComplete) {
      setError("Please complete your delivery address.");
      return;
    }
    if (items.length === 0) {
      setError("Your bag is empty.");
      return;
    }

    setBusy(true);
    try {
      if (paymentMethod === "cod") {
        const { orderNumber } = await createCodOrder(buildOrderPayload());
        clearCart();
        router.push(`/checkout/success?order=${orderNumber}`);
        return;
      }

      // Razorpay flow
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load Razorpay checkout");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: "INR",
        name: "The Bull & Bear Co.",
        description: "Order payment",
        order_id: data.order.id,
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: "#1D2B53" },
        handler: async function (response) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderPayload: buildOrderPayload(),
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error || "Payment verification failed");
            setBusy(false);
            return;
          }
          clearCart();
          router.push(`/checkout/success?order=${verifyData.orderNumber}`);
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong");
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink mb-2">Your bag is empty</p>
        <Link href="/" className="text-ink underline text-sm">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="px-4 pt-6 pb-2">
        <h1 className="font-display font-bold text-2xl text-ink">Checkout</h1>
      </div>

      {!isSupabaseConfigured && (
        <div className="mx-4 mt-2 mb-4 bg-gold/15 border border-gold/40 rounded-lg px-3 py-2 text-xs text-ink">
          Demo mode — orders won't be saved until Supabase is connected. See SETUP.md.
        </div>
      )}

      <div className="px-4 py-4 border-b border-line">
        <h2 className="text-sm font-bold text-ink mb-3 uppercase tracking-wide">Delivery Address</h2>
        <div className="space-y-3">
          <input
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <div className="flex border border-line rounded-lg overflow-hidden">
            <span className="flex items-center px-3 bg-mist text-sm font-medium border-r border-line">+91</span>
            <input
              placeholder="Mobile Number"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              className="flex-1 px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <input
            placeholder="Address Line 1 (House no, Street)"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <input
            placeholder="Address Line 2 (optional)"
            value={address.line2}
            onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
            <input
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
          <input
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="px-4 py-4 border-b border-line">
        <h2 className="text-sm font-bold text-ink mb-3 uppercase tracking-wide">Order Summary</h2>
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm py-1.5">
            <span className="text-graphite">
              {item.name} ({item.size}) × {item.qty}
            </span>
            <span className="text-ink font-medium tabular">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-4 border-b border-line">
        <h2 className="text-sm font-bold text-ink mb-3 uppercase tracking-wide">Coupon Code</h2>
        <div className="flex gap-2">
          <input
            placeholder="Enter code"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink uppercase"
          />
          <button
            onClick={applyCoupon}
            className="px-4 bg-ink text-paper rounded-lg text-sm font-semibold"
          >
            Apply
          </button>
        </div>
        {couponMsg && (
          <p className={`text-xs mt-2 ${coupon?.valid ? "text-green" : "text-red"}`}>{couponMsg}</p>
        )}
      </div>

      <div className="px-4 py-4 border-b border-line space-y-2 tabular">
        <div className="flex justify-between text-sm">
          <span className="text-graphite">Subtotal</span>
          <span className="text-ink">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-graphite">Shipping</span>
          <span className="text-ink">{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-graphite">Coupon Discount</span>
            <span className="text-green">− ₹{discount}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-2 border-t border-line">
          <span className="text-ink">Total</span>
          <span className="text-ink">₹{total}</span>
        </div>
        <p className="text-[11px] text-graphite">Inclusive of all taxes</p>
      </div>

      <div className="px-4 py-4 border-b border-line">
        <h2 className="text-sm font-bold text-ink mb-3 uppercase tracking-wide">Payment Method</h2>
        <div className="space-y-2">
          <button
            onClick={() => setPaymentMethod("razorpay")}
            className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-sm font-medium ${
              paymentMethod === "razorpay" ? "border-ink bg-mist" : "border-line"
            }`}
          >
            UPI / Card / Netbanking
            <span
              className={`w-5 h-5 rounded-full border shrink-0 ${
                paymentMethod === "razorpay" ? "bg-ink border-ink" : "border-line"
              }`}
            />
          </button>
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-sm font-medium ${
              paymentMethod === "cod" ? "border-ink bg-mist" : "border-line"
            }`}
          >
            Cash on Delivery
            <span
              className={`w-5 h-5 rounded-full border shrink-0 ${
                paymentMethod === "cod" ? "bg-ink border-ink" : "border-line"
              }`}
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red text-sm px-4 pt-4">{error}</p>}

      <div className="px-4 pt-6">
        <button
          onClick={placeOrder}
          disabled={busy}
          className="w-full bg-ink text-paper py-4 rounded-lg font-semibold tracking-wide active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {busy ? "Processing..." : paymentMethod === "cod" ? `Place Order — ₹${total}` : `Pay ₹${total}`}
        </button>
      </div>
    </div>
  );
}

