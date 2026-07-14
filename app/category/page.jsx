"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { categories, collections } from "@/lib/data";

const topTabs = [
  "Men",
  "Women",
  "Travel",
  "Signature Edit",
  "Polos",
  "Shirts",
  "Tees",
  "Co-ord Sets",
  "Joggers",
  "Shorts",
  "Hoodies",
  "Jackets",
];

// Fallback tile image for a subcategory slug not present in the collections list.
function tileImage(slug) {
  const match = collections.find((c) => c.slug === slug);
  if (match) return match.image;
  return "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80";
}

export default function CategoryPage() {
  const [activeTab, setActiveTab] = useState("Men");

  const tiles = categories
    .filter((c) => c.slug !== "men" && c.slug !== "women")
    .map((c) => ({ ...c, image: tileImage(c.slug) }));

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 8rem)" }}>
      <div className="w-28 shrink-0 bg-mist border-r border-line overflow-y-auto">
        {topTabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left px-3 py-4 text-[11px] font-semibold uppercase tracking-wide border-l-2 transition-colors ${
                active
                  ? "bg-paper border-ink text-ink"
                  : "border-transparent text-graphite"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <h1 className="text-xs font-bold uppercase tracking-wide text-ink mb-3 px-1">
          {activeTab}
        </h1>
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((tile) => (
            <Link
              key={tile.slug}
              href={`/collection/${tile.slug}`}
              className="block active:scale-[0.97] transition-transform"
            >
              <div className="relative aspect-[4/5] bg-paper overflow-hidden">
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-paper/90 backdrop-blur rounded-full p-1">
                  <Plus size={14} className="text-ink" />
                </span>
              </div>
              <p className="text-center mt-2 text-[11px] font-semibold uppercase tracking-wide text-ink">
                {tile.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

