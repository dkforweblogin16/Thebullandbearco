// FILE PATH: lib/reviews.js
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export async function fetchReviews(productId) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function submitReview({ productId, userId, reviewerName, rating, comment }) {
  if (!isSupabaseConfigured) {
    throw new Error("Reviews need Supabase connected — see SETUP.md");
  }
  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: userId || null,
    reviewer_name: reviewerName || "Anonymous",
    rating,
    comment: comment || null,
  });
  if (error) throw error;
}

