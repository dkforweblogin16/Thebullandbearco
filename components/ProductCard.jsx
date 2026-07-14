"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/store/useCart";

export default function ProductCard({ product, showReviews = false, className = "" }) {
  const addItem = useCart((s) => s.addItem);
  const hasMultipleImages = product.images.length > 1;

  return (
    <div className={`group w-full ${className}`}>
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-mist overflow-hidden rounded-xl">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="45vw"
            className="object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, product.sizes[1] || product.sizes[0]);
            }}
            aria-label="Quick add to cart"
            className="absolute top-2 right-2 bg-paper/90 backdrop-blur rounded-full p-1.5 active:scale-90 transition-transform"
          >
            <Plus size={16} className="text-ink" />
          </button>
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-paper border border-line rounded-md px-2 py-1">
            <Star size={12} className="fill-gold text-gold" />
            <span className="text-[11px] font-bold text-ink">
              {product.rating}
              {showReviews && (
                <span className="text-graphite font-medium">
                  {" "}
                  | {product.reviews}
                </span>
              )}
            </span>
          </div>
          {hasMultipleImages && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-ink/40 backdrop-blur rounded-full px-2 py-1">
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === 0 ? "w-3 bg-paper" : "w-1 bg-paper/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="pt-2.5">
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold border border-line rounded-md px-2 py-0.5 text-graphite"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/product/${product.id}`}>
          <p className="text-sm font-medium leading-snug line-clamp-1 text-ink">
            {product.name}
          </p>
        </Link>
        <div className="flex items-baseline gap-2 mt-1 tabular">
          <span className="font-bold text-[15px] text-ink">₹{product.price}</span>
          <span className="text-graphite line-through text-xs">
            ₹{product.originalPrice}
          </span>
          <span className="text-xs font-bold text-green">
            {product.discount}
          </span>
        </div>
        <p className="text-[11px] text-violet font-medium mt-0.5">
          Lowest price in last 30 days
        </p>
      </div>
    </div>
  );
}
