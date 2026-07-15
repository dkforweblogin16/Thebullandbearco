// FILE PATH: app/wishlist/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/store/useWishlist";
import { fetchAllProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts().then((all) => {
      setProducts(all.filter((p) => ids.includes(p.id)));
      setLoading(false);
    });
  }, [ids]);

  if (loading) return <div className="min-h-[40vh]" />;

  if (products.length === 0) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink mb-2">
          Your wishlist is empty
        </p>
        <Link href="/" className="text-ink underline text-sm">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-5">
        My Wishlist
      </h1>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
