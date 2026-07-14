"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingBag, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { getProductById, products } from "@/lib/data";
import { useCart } from "@/store/useCart";
import ProductCard from "@/components/ProductCard";
import ProductFeed from "@/components/ProductFeed";
import SortSheet from "@/components/SortSheet";
import FilterSheet, { priceRanges, emptyFilters } from "@/components/FilterSheet";

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductById(params.id);
  const addItem = useCart((s) => s.addItem);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);

  if (!product) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-display text-xl text-ink">Item not found.</p>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const activeFilterCount =
    (filters.price ? 1 : 0) +
    (filters.colors?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.availability ? 1 : 0);

  const feed = useMemo(() => {
    let items = products.filter((p) => p.id !== product.id);

    if (filters.price) {
      const range = priceRanges.find((r) => r.key === filters.price);
      if (range) items = items.filter((p) => range.test(p.price));
    }
    if (filters.sizes?.length) {
      items = items.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    }

    if (sortBy === "price-low") items = [...items].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") items = [...items].sort((a, b) => b.price - a.price);
    if (sortBy === "best") items = [...items].sort((a, b) => b.rating - a.rating);
    if (sortBy === "new") items = [...items].sort((a, b) => b.id - a.id);

    return items;
  }, [product.id, filters, sortBy]);

  function handleAddToCart() {
    addItem(product, size || product.sizes[1] || product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="pb-24">
      <div className="relative w-full aspect-[4/5] bg-mist">
        <Image
          src={product.images[activeImg]}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-1 rounded-full transition-all ${
                  i === activeImg ? "w-6 bg-paper" : "w-1.5 bg-paper/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-1.5">
          <Star size={15} className="fill-gold text-gold" />
          <span className="text-sm font-bold text-ink">{product.rating}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold border border-line rounded-md px-3 py-1 text-graphite"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display font-bold text-2xl leading-tight text-ink">
            {product.name}
          </h1>
          <button
            onClick={handleAddToCart}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold tracking-wide active:scale-95 transition-transform ${
              added ? "bg-green text-paper" : "bg-ink text-paper"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
            {!added && <ShoppingBag size={15} />}
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-3 tabular">
          <span className="font-bold text-2xl text-ink">₹{product.price}</span>
          <span className="text-graphite line-through text-base">
            ₹{product.originalPrice}
          </span>
          <span className="text-green text-sm font-bold">
            {product.discount}
          </span>
        </div>
        <p className="text-sm text-violet font-medium mt-1">
          Lowest price in last 30 days
        </p>

        <p className="text-sm text-graphite leading-relaxed mt-4">
          {product.description}
        </p>

        <div className="mt-6">
          <p className="text-sm font-semibold mb-2 text-ink">Select Size</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-12 h-12 rounded-full border text-sm font-semibold transition-colors ${
                  size === s
                    ? "bg-ink text-paper border-ink"
                    : "border-line text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10 mb-6">
          <h2 className="font-display font-bold text-xl px-4 mb-4 text-ink">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-line pt-8">
        <h2 className="font-display font-bold text-xl px-4 mb-4 text-ink">
          Our Bestsellers
        </h2>
        <ProductFeed products={feed} />
      </div>

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
