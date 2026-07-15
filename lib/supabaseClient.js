// FILE PATH: lib/supabaseClient.js
// Browser-side Supabase client. Uses the public anon key — safe to expose,
// access is controlled by Row Level Security policies (see supabase/schema.sql).
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

// The site works fully on mock data until these env vars are set —
// every data-access function checks this before touching Supabase.
export const isSupabaseConfigured = Boolean(supabase);

