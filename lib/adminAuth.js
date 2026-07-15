// FILE PATH: lib/adminAuth.js
// Lightweight admin-session check for the solo-owner admin panel.
// The cookie is httpOnly (never readable by client JS) and is only ever
// set by /api/admin/login after the passcode matches ADMIN_PASSCODE.
// This is intentionally simple for a single-owner MVP — swap for real
// role-based auth (e.g. a Supabase "is_admin" flag) before you have staff.
export function isAdminRequest(req) {
  const cookie = req.cookies.get("admin_auth")?.value;
  return Boolean(cookie) && Boolean(process.env.ADMIN_PASSCODE) && cookie === process.env.ADMIN_PASSCODE;
}

