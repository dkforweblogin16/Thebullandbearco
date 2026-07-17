// FILE PATH: components/ProductAccordions.jsx
"use client";

import { useState } from "react";
import { FileText, Truck, RotateCcw, Star, ChevronDown } from "lucide-react";

export default function ProductAccordions({ description, rating, reviewCount }) {
  const [open, setOpen] = useState(null);

  function toggle(key) {
    setOpen(open === key ? null : key);
  }

  function scrollToReviews() {
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  }

  const items = [
    {
      key: "description",
      icon: FileText,
      title: "Product Description",
      subtitle: "Manufacture, Care and Fit",
      content: `${description} Machine wash cold with like colors. Do not bleach. Tumble dry low. Warm iron if needed.`,
    },
    {
      key: "shipping",
      icon: Truck,
      title: "Free Shipping",
      subtitle: "We offer free shipping across India",
      content:
        "Orders above ₹999 ship free. Orders below that carry a flat ₹79 shipping fee, added at checkout.",
    },
    {
      key: "returns",
      icon: RotateCcw,
      title: "7 Days Returns & Exchange",
      subtitle: "Know about return & exchange policy",
      content:
        "Unworn, tagged items can be returned or exchanged within 7 days of delivery. Start a return from My Orders once the item arrives.",
    },
  ];

  return (
    <div className="mt-6 border-t border-line">
      {items.map((item) => {
        const Icon = item.icon;
        const isOpen = open === item.key;
        return (
          <div key={item.key} className="border-b border-line">
            <button
              onClick={() => toggle(item.key)}
              className="w-full flex items-center gap-3 py-4 text-left"
            >
              <Icon size={20} className="text-ink shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-ink">{item.title}</p>
                <p className="text-xs text-graphite">{item.subtitle}</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-graphite transition-transform shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <p className="text-sm text-graphite leading-relaxed pb-4 pl-8">
                {item.content}
              </p>
            )}
          </div>
        );
      })}

      <button
        onClick={scrollToReviews}
        className="w-full flex items-center gap-3 py-4 text-left"
      >
        <Star size={20} className="text-ink shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm text-ink">
            Reviews {rating}/5
          </p>
          <p className="text-xs text-graphite">
            Based on {reviewCount} customer review{reviewCount === 1 ? "" : "s"}
          </p>
        </div>
        <ChevronDown size={16} className="text-graphite shrink-0 -rotate-90" />
      </button>
    </div>
  );
}

