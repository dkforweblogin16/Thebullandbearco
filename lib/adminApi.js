// FILE PATH: lib/adminApi.js
import { supabase } from "./supabaseClient";

// Calls one of the /api/admin/** routes, automatically attaching the
// current admin's session token so the server can verify is_admin.
//
// Every write route (POST/PATCH/DELETE) additionally requires the
// "elevated" passcode session (see lib/adminAuth.js requireElevated). If
// that's missing, the server replies 401 with { code: "elevated_required" }.
// We attach that code to the thrown Error and broadcast a window event so
// a single global <ElevatedAccessGate/> (mounted once in the admin
// layout) can pop the passcode modal, no matter which page triggered it.
export async function adminFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const res = await fetch(path, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json.message || json.error || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.code = json.code;
    if (err.code === "elevated_required" && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("admin:elevated-required"));
    }
    throw err;
  }
  return json;
}

