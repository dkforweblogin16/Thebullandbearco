// FILE PATH: app/api/admin/reviews/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(request, { params }) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  const body = await request.json(); // { is_approved: true/false }
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ review: data });
}

export async function DELETE(request, { params }) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

