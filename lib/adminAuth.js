// FILE PATH: lib/adminAuth.js
import crypto from "crypto";
import { supabaseAdmin, isAdminConfigured } from "./supabaseAdmin";

// ---------------------------------------------------------------------
// TWO-TIER ADMIN ACCESS
//
// Tier 1 - "signed-in admin" (requireAdmin): any Supabase user whose
// profiles.is_admin = true. This is enough to VIEW the dashboard and all
// admin pages (read-only: every GET route only calls requireAdmin).
//
// Tier 2 - "elevated control" (requireElevated): on top of tier 1, the
// browser must also hold a short-lived "admin_elevated" cookie, which is
// only set after the admin types the shared ADMIN_PASSCODE into the
// unlock modal (see /api/admin/elevate). Every route that creates,
// edits, or deletes something (POST / PATCH / DELETE) calls this instead
// of requireAdmin.
// ---------------------------------------------------------------------

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

// The value we store in the "admin_elevated" cookie: a one-way hash of
// the current ADMIN_PASSCODE. We never store the passcode itself in the
// cookie. If ADMIN_PASSCODE is ever changed on the server, every
// previously-issued cookie stops matching automatically.
export function elevatedCookieValue() {
  return crypto
    .createHash("sha256")
    .update(String(process.env.ADMIN_PASSCODE || ""))
    .digest("hex");
}

// Requires BOTH tier 1 (signed-in admin) AND tier 2 (elevated passcode
// cookie). Use this at the top of every route that writes/edits/deletes.
export async function requireElevated(request) {
  const check = await requireAdmin(request);
  if (!check.ok) return check;

  if (!process.env.ADMIN_PASSCODE) {
    return {
      ok: false,
      status: 500,
      message: "ADMIN_PASSCODE is not set on the server.",
    };
  }

  const cookie = request.cookies?.get?.("admin_elevated")?.value;
  if (!cookie || cookie !== elevatedCookieValue()) {
    return {
      ok: false,
      status: 401,
      code: "elevated_required",
      message: "Enter the access passcode to make changes.",
    };
  }

  return check;
}
