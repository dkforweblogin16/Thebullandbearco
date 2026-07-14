"use client";

import { X, Check } from "lucide-react";

export const sortOptions = [
  { key: "featured", label: "Featured" },
  { key: "new", label: "New Arrivals" },
  { key: "best", label: "Best Selling" },
  { key: "price-low", label: "Price Low to High" },
  { key: "price-high", label: "Price High to Low" },
];

export default function SortSheet({ open, onClose, value, onChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 bg-paper rounded-t-2xl"
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-line">
          <h2 className="font-display font-bold text-2xl text-ink">Sort by</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-ink flex items-center justify-center shrink-0"
          >
            <X size={18} className="text-paper" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {sortOptions.map((opt) => {
            const active = value === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => {
                  onChange(opt.key);
                  onClose();
                }}
                className="w-full flex items-center gap-4 py-4 border-b border-line last:border-0"
              >
                <span
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? "bg-gold border-gold" : "border-line"
                  }`}
                >
                  {active && <Check size={14} className="text-ink" strokeWidth={3} />}
                </span>
                <span className="text-base text-ink">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
