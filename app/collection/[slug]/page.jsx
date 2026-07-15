// FILE PATH: app/collection/[slug]/page.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductFeed from "@/components/ProductFeed";
import SortSheet from "@/components/SortSheet";
import FilterSheet, { priceRanges, emptyFilters } from "@/components/FilterSheet";
import { fetchAllProducts } from "@/lib/products";
import { categories, collections } from "@/lib/data";

const fitPills = ["All", "Classic", "Oversized", "Polo"];

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug;

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePill, setActivePill] = useState("All");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);

  useEffect(() => {
    fetchAllProducts().then((data) => {
      setAllProducts(data);
      setLoading(false);
    });
  }, []);

  const meta =
    categories.find((c) => c.slug === slug) ||
    collections.find((c) => c.slug === slug) || { label: "All Products" };

  const banner =
    collections.find((c) => c.slug === slug)?.image ||
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80";

  const activeFilterCount =
    (filters.price ? 1 : 0) +
    (filters.colors?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.availability ? 1 : 0);

  const list = useMemo(() => {
    let items =
      slug === "all" ? allProducts : allProducts.filter((p) => p.category === slug);

    if (activePill !== "All") {
      items = items.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(activePill.toLowerCase()))
      );
    }

    if (filters.price) {
      const range = priceRanges.find((r) => r.key === filters.price);
      if (range) items = items.filter((p) => range.test(p.price));
    }

    if (filters.sizes?.length) {
      items = items.filter((p) =>
        p.sizes.some((s) => filters.sizes.includes(s))
      );
    }

    if (sortBy === "price-low") items = [...items].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") items = [...items].sort((a, b) => b.price - a.price);
    if (sortBy === "best") items = [...items].sort((a, b) => b.rating - a.rating);
    if (sortBy === "new") items = [...items].sort((a, b) => String(b.id).localeCompare(String(a.id)));

    return items;
  }, [allProducts, slug, activePill, sortBy, filters]);

  return (
    <div className="pb-16">
      <div className="relative h-40 bg-ink">
        <img
          src={banner}
          alt={meta.label}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display font-black text-2xl text-paper tracking-wide uppercase">
            {meta.label}
          </h1>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
        {fitPills.map((pill) => (
          <button
            key={pill}
            onClick={() => setActivePill(pill)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activePill === pill
                ? "bg-ink text-paper border-ink"
                : "border-line text-graphite"
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      <p className="px-4 text-sm text-graphite mb-3">
        {loading ? "Loading..." : `${list.length} items`}
      </p>

      {!loading && list.length > 0 && <ProductFeed products={list} />}
      {!loading && list.length === 0 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4">
          <p className="col-span-2 text-center text-graphite py-10 text-sm">
            No positions here yet — check back soon.
          </p>
        </div>
      )}

      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={sortBy}
        onChange={setSortBy}
      />
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      <div className="fixed bottom-16 left-0 right-0 z-30 bg-paper border-t border-line flex divide-x divide-line">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-ink"
        >
          <SlidersHorizontal size={16} />
          Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        <button
          onClick={() => setSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-ink"
        >
          <ArrowUpDown size={16} /> Sort
        </button>
      </div>
    </div>
  );
}
