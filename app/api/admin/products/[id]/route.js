// FILE PATH: app/api/admin/products/[id]/route.js
import { NextResponse } from "next/server";
import { requireElevated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// PATCH — edit a product, or toggle is_active (requires elevated passcode session).
export async function PATCH(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }

  const updates = await request.json();
  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

// DELETE — soft-delete (deactivate) a product (requires elevated passcode session).
export async function DELETE(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update({ is_active: false })
    .eq("id", params.id);

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

