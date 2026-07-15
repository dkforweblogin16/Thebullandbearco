// FILE PATH: app/sitemap.js
import { fetchAllProducts } from "@/lib/products";
import { categories } from "@/lib/data";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.vercel.app";
  const products = await fetchAllProducts();

  const staticRoutes = [
    "",
    "/category",
    "/new",
    "/about",
    "/contact",
    "/reviews",
    "/track-order",
    "/returns",
    "/privacy",
    "/terms",
    "/shipping",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/collection/${c.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

