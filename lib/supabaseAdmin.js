// FILE PATH: lib/supabaseAdmin.js
// Server-only Supabase client using the service role key. This bypasses
// Row Level Security, so it must NEVER be imported into a "use client" file
// or a component — only into files under /app/api/**/route.js.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;

export const isAdminConfigured = Boolean(supabaseAdmin);

