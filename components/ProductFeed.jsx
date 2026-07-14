import ProductCard from "@/components/ProductCard";
import PosterBanner from "@/components/PosterBanner";
import { posters } from "@/lib/data";

export default function ProductFeed({ products, batchSize = 4 }) {
  const rows = [];
  for (let i = 0; i < products.length; i += batchSize) {
    rows.push({
      items: products.slice(i, i + batchSize),
      poster: posters[(i / batchSize) % posters.length],
    });
  }

  return (
    <div className="px-4 space-y-6">
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 gap-x-3 gap-y-6">
          {row.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {i < rows.length - 1 && <PosterBanner poster={row.poster} />}
        </div>
      ))}
    </div>
  );
}

