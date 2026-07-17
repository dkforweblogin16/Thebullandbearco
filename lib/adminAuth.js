// FILE PATH: lib/adminAuth.js
import { supabaseAdmin, isAdminConfigured } from "./supabaseAdmin";

// Verifies the request's Bearer token belongs to a signed-in user whose
// profile has is_admin = true. Called at the top of every /api/admin/**
// route before it touches the database. Nothing writes/reads admin data
// unless this returns { ok: true }.
export async function requireAdmin(request) {
  if (!isAdminConfigured) {
    return { ok: false, status: 500, message: "Admin backend not configured." };
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return { ok: false, status: 401, message: "Not signed in." };
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return { ok: false, status: 401, message: "Invalid session." };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile?.is_admin) {
    return { ok: false, status: 403, message: "Not authorized." };
  }

  return { ok: true, user: userData.user };
}
