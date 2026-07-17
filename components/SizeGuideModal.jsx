// FILE PATH: components/SizeGuideModal.jsx
"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

const CHART_INCHES = [
  { size: "S", chest: 38, shoulder: 16.25, length: 26, sleeve: 8 },
  { size: "M", chest: 40, shoulder: 16.75, length: 27, sleeve: 8.25 },
  { size: "L", chest: 42, shoulder: 17.25, length: 28, sleeve: 8.5 },
  { size: "XL", chest: 44, shoulder: 17.75, length: 29, sleeve: 8.75 },
  { size: "XXL", chest: 46, shoulder: 18.5, length: 30, sleeve: 9 },
  { size: "XXXL", chest: 48, shoulder: 19, length: 31, sleeve: 9.25 },
];

function toCm(n) {
  return Math.round(n * 2.54 * 10) / 10;
}

export default function SizeGuideModal({
  open,
  onClose,
  availableSizes,
  selectedSize,
  onSelectSize,
  onAddToCart,
  onBuyNow,
}) {
  const [unit, setUnit] = useState("in");

  if (!open) return null;

  const rows = CHART_INCHES.filter((r) => availableSizes.includes(r.size));

  return (
    <div className="fixed inset-0 z-50 bg-ink/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 bg-paper rounded-t-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-line shrink-0">
          <h2 className="font-display font-bold text-2xl text-ink">Size Guide</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-ink flex items-center justify-center"
          >
            <X size={18} className="text-paper" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-mist rounded-lg px-3 py-2">
              <p className="text-xs font-bold text-ink">Regular Fit</p>
              <p className="text-[11px] text-graphite">Not too tight or loose</p>
            </div>
            <div className="flex border border-line rounded-full overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setUnit("in")}
                className={`px-3 py-1.5 ${unit === "in" ? "bg-gold/20 text-ink" : "text-graphite"}`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit("cm")}
                className={`px-3 py-1.5 ${unit === "cm" ? "bg-gold/20 text-ink" : "text-graphite"}`}
              >
                Cms
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="bg-mist text-left">
                  <th className="px-2 py-2.5 font-semibold text-ink">Size</th>
                  <th className="px-2 py-2.5 font-semibold text-ink">Chest</th>
                  <th className="px-2 py-2.5 font-semibold text-ink">Shoulder</th>
                  <th className="px-2 py-2.5 font-semibold text-ink">Length</th>
                  <th className="px-2 py-2.5 font-semibold text-ink">Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const active = r.size === selectedSize;
                  const conv = (n) => (unit === "in" ? n : toCm(n));
                  return (
                    <tr
                      key={r.size}
                      onClick={() => onSelectSize(r.size)}
                      className={`border-b border-line ${active ? "bg-gold/10" : ""}`}
                    >
                      <td className="px-2 py-3 font-semibold text-ink">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              active ? "bg-gold" : "border border-line"
                            }`}
                          >
                            {active && <Check size={12} className="text-ink" />}
                          </span>
                          {r.size}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-graphite">{conv(r.chest)}</td>
                      <td className="px-2 py-3 text-graphite">{conv(r.shoulder)}</td>
                      <td className="px-2 py-3 text-graphite">{conv(r.length)}</td>
                      <td className="px-2 py-3 text-graphite">{conv(r.sleeve)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-line shrink-0">
          <button
            onClick={onAddToCart}
            className="flex-1 border border-ink text-ink py-3.5 rounded-lg font-semibold text-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={onBuyNow}
            className="flex-1 bg-ink text-paper py-3.5 rounded-lg font-semibold text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

