// FILE PATH: app/orders/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { fetchOrderById } from "@/lib/orders";

const timeline = ["placed", "confirmed", "shipped", "delivered"];
const timelineLabel = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(params.id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div className="min-h-[40vh]" />;

  if (!order) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink">Order not found</p>
      </div>
    );
  }

  const cancelled = order.order_status === "cancelled";
  const currentStep = timeline.indexOf(order.order_status);

  return (
    <div className="px-4 pt-6 pb-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-1 tabular">
        {order.order_number}
      </h1>
      <p className="text-graphite text-sm mb-6">
        Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {!cancelled && (
        <div className="flex items-center mb-8">
          {timeline.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div
                  className={`absolute top-3 right-1/2 w-full h-0.5 -z-10 ${
                    i <= currentStep ? "bg-ink" : "bg-line"
                  }`}
                />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= currentStep ? "bg-ink text-paper" : "bg-line text-graphite"
                }`}
              >
                {i <= currentStep ? <Check size={13} /> : i + 1}
              </div>
              <p className="text-[10px] text-center mt-2 text-graphite font-medium">
                {timelineLabel[step]}
              </p>
            </div>
          ))}
        </div>
      )}

      {cancelled && (
        <div className="bg-red/10 text-red text-sm font-semibold rounded-lg px-4 py-3 mb-6">
          This order was cancelled.
        </div>
      )}

      <div className="border border-line rounded-xl p-4 mb-4">
        <h2 className="text-sm font-bold text-ink mb-3 uppercase tracking-wide">Items</h2>
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1.5">
            <span className="text-graphite">
              {item.name} ({item.size}) × {item.qty}
            </span>
            <span className="text-ink font-medium tabular">₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="flex justify-between text-base font-bold pt-3 mt-2 border-t border-line tabular">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      <div className="border border-line rounded-xl p-4">
        <h2 className="text-sm font-bold text-ink mb-2 uppercase tracking-wide">Delivery Address</h2>
        <p className="text-sm text-graphite leading-relaxed">
          {order.address?.fullName}<br />
          {order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ""}<br />
          {order.address?.city}, {order.address?.state} — {order.address?.pincode}<br />
          {order.address?.phone}
        </p>
      </div>
    </div>
  );
}

