// FILE PATH: app/api/admin/settings/route.js
import { NextResponse } from "next/server";
import { requireAdmin, requireElevated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET is admin-only here (returns everything at once for the dashboard
// form). The storefront reads individual keys directly via the public
// anon client instead (site_settings has a public-read RLS policy).
export async function GET(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  const { data, error } = await supabaseAdmin.from("site_settings").select("*");
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  const settings = {};
  (data || []).forEach((row) => {
    settings[row.key] = row.value;
  });
  return NextResponse.json({ settings });
}

// Body: { key: "announcement_bar", value: {...} }
export async function PATCH(request) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }
  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ message: "Missing key." }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ setting: data });
}

