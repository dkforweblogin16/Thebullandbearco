// FILE PATH: app/api/admin/messages/[id]/route.js
import { NextResponse } from "next/server";
import { requireElevated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }
  const body = await request.json(); // { is_read: true/false }
  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}

export async function DELETE(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }
  const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

