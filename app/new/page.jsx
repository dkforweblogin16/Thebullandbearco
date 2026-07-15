// FILE PATH: app/new/page.jsx
import TrendingProducts from "@/components/TrendingProducts";
import { fetchAllProducts } from "@/lib/products";

export const metadata = { title: "New Arrivals | The Bull & Bear Co." };
export const revalidate = 60;

export default async function NewPage() {
  const products = await fetchAllProducts();

  return (
    <div className="pt-6">
      <h1 className="font-display font-black text-3xl text-center px-4">
        New Arrivals
      </h1>
      <p className="text-graphite text-sm text-center mt-2 px-4">
        Fresh off the press. Signal, not noise.
      </p>
      <TrendingProducts title="" subtitle="" count={4} products={products} />
    </div>
  );
}
