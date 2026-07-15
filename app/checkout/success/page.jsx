// FILE PATH: app/checkout/success/page.jsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <div className="px-6 pt-16 pb-10 text-center">
      <div className="w-16 h-16 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={30} className="text-green" />
      </div>
      <h1 className="font-display font-bold text-2xl text-ink mb-2">
        Order Placed!
      </h1>
      <p className="text-graphite text-sm mb-1">Your order number is</p>
      <p className="font-display font-bold text-xl text-ink mb-8 tabular">
        {orderNumber || "—"}
      </p>
      <p className="text-graphite text-sm max-w-xs mx-auto mb-8">
        We'll send updates on delivery. You can track this order anytime with
        your order number and phone number.
      </p>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Link
          href="/track-order"
          className="bg-ink text-paper py-3.5 rounded-lg font-semibold text-sm"
        >
          Track This Order
        </Link>
        <Link
          href="/"
          className="border border-line py-3.5 rounded-lg font-semibold text-sm text-ink"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SuccessContent />
    </Suspense>
  );
}

