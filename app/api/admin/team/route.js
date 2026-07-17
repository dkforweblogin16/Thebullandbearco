// FILE PATH: app/api/admin/team/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, phone, is_admin, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ profiles: data, currentUserId: check.user.id });
}

