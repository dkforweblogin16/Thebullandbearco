// FILE PATH: lib/products.js
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { products as mockProducts } from "./data";

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
  };
}

// Reads the live catalog from Supabase once it's connected; falls back to
// the built-in mock catalog so the storefront keeps working before setup.
export async function fetchAllProducts() {
  if (!isSupabaseConfigured) return mockProducts;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return mockProducts;
  return data.map(normalize);
}

export async function fetchProductById(id) {
  if (!isSupabaseConfigured) {
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

