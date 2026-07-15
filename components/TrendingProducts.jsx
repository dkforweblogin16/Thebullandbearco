// FILE PATH: components/TrendingProducts.jsx
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products as mockProducts } from "@/lib/data";

export default function TrendingProducts({
  title = "Trending Now",
  subtitle = "Handpicked for the trading desk",
  count = 4,
  offset = 0,
  seeAllHref = "/collection/all",
  products,
}) {
  const source = products || mockProducts;
  const list = source.slice(offset, offset + count);

  return (
    <section className="py-10">
      {title && (
        <h2 className="font-display font-bold text-2xl text-center text-ink">{title}</h2>
      )}
      {subtitle && (
        <p className="text-graphite text-sm text-center mt-1 mb-6">{subtitle}</p>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} showReviews />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 mt-8">
        <Link
          href={seeAllHref}
          className="border border-ink text-ink px-8 py-3 text-sm font-semibold tracking-wide active:bg-ink active:text-paper transition-colors"
        >
          Shop All Products
        </Link>
        <div className="flex gap-1.5">
          <span className="h-1 w-6 rounded-full bg-ink" />
          <span className="h-1 w-1.5 rounded-full bg-line" />
        </div>
      </div>
    </section>
  );
}
