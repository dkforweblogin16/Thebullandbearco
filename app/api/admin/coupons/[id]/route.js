// FILE PATH: app/api/admin/coupons/[id]/route.js
import { NextResponse } from "next/server";
import { requireElevated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// PATCH — edit a coupon, or toggle active (requires elevated passcode session).
export async function PATCH(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }

  const body = await request.json();
  const updates = { ...body };
  if (updates.code) updates.code = String(updates.code).toUpperCase();

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ coupon: data });
}

// DELETE — permanently remove a coupon (requires elevated passcode session).
export async function DELETE(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }

  const { error } = await supabaseAdmin.from("coupons").delete().eq("id", params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

