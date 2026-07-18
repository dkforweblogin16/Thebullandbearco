// FILE PATH: lib/contact.js
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export async function submitContactMessage({ name, email, message }) {
  if (!isSupabaseConfigured) {
    throw new Error("Contact form needs Supabase connected — see SETUP.md");
  }
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });
  if (error) throw error;
}
