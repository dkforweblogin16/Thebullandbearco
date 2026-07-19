// FILE PATH: app/product/[id]/page.jsx
import { cache } from "react";
import { fetchProductById } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

// React's cache() ensures fetchProductById(id) only actually hits Supabase
// ONCE per request, even though both generateMetadata and the page below
// call it — the second call reuses the first's result instead of firing a
// second network round trip.
const getProduct = cache(fetchProductById);

// Next.js 14 blocks the ENTIRE route transition (including the loading.jsx
// skeleton) until generateMetadata resolves — measured in a screen
// recording at ~0.65-0.75s of fully blank white per click, matching the
// Supabase round trip time. Racing it against a short timeout means the
// <head> tags get a fast, generic fallback on a slow response, so Next can
// start streaming (and show the skeleton) almost immediately. The actual
// page below still awaits the real data with no timeout, so the product
// itself is never shown with wrong/incomplete info.
function withTimeout(promise, ms, fallbackValue) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(fallbackValue), ms)),
  ]);
}

export async function generateMetadata({ params }) {
  const product = await withTimeout(getProduct(params.id), 300, undefined);

  if (product === undefined) {
    // The DB call didn't answer within 300ms — ship generic metadata now
    // instead of making the whole navigation wait on it.
    return {
      title: "The Bull & Bear Co.",
      description: "Shop premium streetwear at The Bull & Bear Co.",
    };
  }
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

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetailClient id={params.id} initialProduct={product} />;
}
