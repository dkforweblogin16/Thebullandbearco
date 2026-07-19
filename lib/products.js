// FILE PATH: lib/products.js
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { products as mockProducts } from "./data";

// Set NEXT_PUBLIC_USE_MOCK_CATALOG=true in Vercel's Environment Variables
// while the Supabase "products" table is still empty. With it on, every
// product/category fetch skips the Supabase network round-trip entirely
// and reads the local mock catalog instantly (no delay, no loading flash).
// Once real products are added in Supabase, remove this env var (or set
// it to "false") and redeploy — no code changes needed.
const USE_MOCK_CATALOG =
  process.env.NEXT_PUBLIC_USE_MOCK_CATALOG === "true" || !isSupabaseConfigured;

function normalize(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: Number(row.original_price ?? row.price),
    discount: row.discount_label || "",
    rating: Number(row.rating ?? 4.5),
    reviews: Number(row.review_count ?? 0),
    category: row.category,
    tags: row.tags || [],
    images: row.images?.length ? row.images : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
    sizes: row.sizes?.length ? row.sizes : ["S", "M", "L", "XL"],
    description: row.description || "",
    stock: row.stock || {},
    colors: row.colors || [], // color variants added by the admin dashboard
  };
}

// Reads the live catalog from Supabase once it's connected; falls back to
// the built-in mock catalog so the storefront keeps working before setup,
// and while the real catalog is still empty.
export async function fetchAllProducts() {
  if (USE_MOCK_CATALOG) return mockProducts;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return mockProducts;
  return data.map(normalize);
}

export async function fetchProductById(id) {
  if (USE_MOCK_CATALOG) {
    return mockProducts.find((p) => String(p.id) === String(id)) || null;
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return mockProducts.find((p) => String(p.id) === String(id)) || null;
  }
  return normalize(data);
}

// New: fetch products for a single category/collection page. Falls back
// to the mock catalog the same way fetchAllProducts does, so /collection/*
// pages keep working today and switch to real data automatically once
// products exist in Supabase.
export async function fetchProductsByCategory(slug) {
  if (!slug || slug === "all") return fetchAllProducts();

  if (USE_MOCK_CATALOG) {
    return mockProducts.filter((p) => p.category === slug);
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", slug)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    return mockProducts.filter((p) => p.category === slug);
  }
  return data.map(normalize);
}
