"use client";

import Image from "next/image";
import { Check } from "lucide-react";

export default function ColorSwatches({ colors, activeIndex, onSelect }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-ink mb-2">
        Select Color <span className="text-graphite font-normal">- {colors[activeIndex].name}</span>
      </p>
      <div className="flex gap-3 flex-wrap">
        {colors.map((c, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={c.name}
              onClick={() => onSelect(i)}
              aria-label={c.name}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                active ? "border-ink" : "border-line"
              }`}
            >
              <Image src={c.swatch} alt={c.name} fill className="object-cover" />
              {active && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/10">
                  <span className="w-5 h-5 rounded-full bg-paper flex items-center justify-center">
                    <Check size={13} className="text-green" strokeWidth={3} />
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

