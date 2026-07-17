// FILE PATH: lib/adminApi.js
import { supabase } from "./supabaseClient";

// Calls one of the /api/admin/** routes, automatically attaching the
// current admin's session token so the server can verify is_admin.
export async function adminFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

