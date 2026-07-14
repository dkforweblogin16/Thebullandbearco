"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export const priceRanges = [
  { key: "u500", label: "Less than ₹500", test: (p) => p < 500 },
  { key: "500-1000", label: "₹500 - ₹1000", test: (p) => p >= 500 && p <= 1000 },
  { key: "1000-1500", label: "₹1000 - ₹1500", test: (p) => p > 1000 && p <= 1500 },
  { key: "1500-2000", label: "₹1500 - ₹2000", test: (p) => p > 1500 && p <= 2000 },
  { key: "o2000", label: "More than ₹2000", test: (p) => p > 2000 },
];

const colorOptions = [
  { key: "black", label: "Black", swatch: "#111111" },
  { key: "white", label: "White", swatch: "#FFFFFF" },
  { key: "navy", label: "Navy", swatch: "#1D2B53" },
  { key: "olive", label: "Olive", swatch: "#5C6D4B" },
  { key: "maroon", label: "Maroon", swatch: "#7A2231" },
];

const sizeOptions = ["S", "M", "L", "XL", "XXL"];
const tabs = ["Price", "Color", "Size", "Availability"];

export const emptyFilters = { price: null, colors: [], sizes: [], availability: null };

export default function FilterSheet({ open, onClose, filters, onApply }) {
  const [activeTab, setActiveTab] = useState("Price");
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  if (!open) return null;

  function toggleSingle(key, value) {
    setDraft((d) => ({ ...d, [key]: d[key] === value ? null : value }));
  }

  function toggleMulti(key, value) {
    setDraft((d) => {
      const arr = d[key] || [];
      return {
        ...d,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function clearAll() {
    setDraft(emptyFilters);
  }

  function apply() {
    onApply(draft);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 bg-paper rounded-t-2xl max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-line shrink-0">
          <h2 className="font-display font-bold text-2xl text-ink">Filters</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-ink flex items-center justify-center shrink-0"
          >
            <X size={18} className="text-paper" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-28 shrink-0 bg-mist overflow-y-auto">
            {tabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`block w-full text-left px-3 py-4 text-sm border-l-2 transition-colors ${
                    active
                      ? "bg-paper border-ink text-ink font-semibold"
                      : "border-transparent text-graphite"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-2">
            {activeTab === "Price" && (
              <div>
                {priceRanges.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => toggleSingle("price", r.key)}
                    className="w-full flex items-center justify-between py-4 border-b border-line"
                  >
                    <span className="text-ink text-[15px]">{r.label}</span>
                    <span
                      className={`w-5 h-5 rounded-full border shrink-0 ${
                        draft.price === r.key
                          ? "border-ink bg-ink"
                          : "border-line"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {activeTab === "Color" && (
              <div>
                {colorOptions.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => toggleMulti("colors", c.key)}
                    className="w-full flex items-center justify-between py-4 border-b border-line"
                  >
                    <span className="flex items-center gap-3 text-ink text-[15px]">
                      <span
                        className="w-5 h-5 rounded-full border border-line shrink-0"
                        style={{ background: c.swatch }}
                      />
                      {c.label}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border shrink-0 ${
                        draft.colors?.includes(c.key)
                          ? "border-ink bg-ink"
                          : "border-line"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {activeTab === "Size" && (
              <div className="flex flex-wrap gap-2 py-3">
                {sizeOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleMulti("sizes", s)}
                    className={`w-14 h-14 rounded-full border text-sm font-semibold transition-colors ${
                      draft.sizes?.includes(s)
                        ? "bg-ink text-paper border-ink"
                        : "border-line text-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {activeTab === "Availability" && (
              <div>
                {["In Stock", "Out of Stock"].map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleSingle("availability", a)}
                    className="w-full flex items-center justify-between py-4 border-b border-line"
                  >
                    <span className="text-ink text-[15px]">{a}</span>
                    <span
                      className={`w-5 h-5 rounded-full border shrink-0 ${
                        draft.availability === a
                          ? "border-ink bg-ink"
                          : "border-line"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-line shrink-0">
          <button
            onClick={clearAll}
            className="flex-1 py-3.5 bg-mist text-ink font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={apply}
            className="flex-1 py-3.5 bg-ink text-paper font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
