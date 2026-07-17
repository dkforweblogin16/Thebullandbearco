// FILE PATH: lib/reviews.js
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export async function fetchReviews(productId) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true) // only show reviews the admin has approved
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
    is_approved: false, // goes live only after admin approves it in /admin/reviews
  });
  if (error) throw error;
}
