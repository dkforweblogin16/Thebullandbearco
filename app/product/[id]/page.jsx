// FILE PATH: app/product/[id]/page.jsx
import { fetchProductById } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  const product = await fetchProductById(params.id);
  if (!product) {
    return { title: "Product Not Found | The Bull & Bear Co." };
  }
  return {
    title: `${product.name} | The Bull & Bear Co.`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default function ProductDetailPage({ params }) {
  return <ProductDetailClient id={params.id} />;
}
