// FILE PATH: app/api/admin/products/route.js
import { NextResponse } from "next/server";
import { requireAdmin, requireElevated } from "@/lib/adminAuth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabaseAdmin";

// GET — list all products (any signed-in admin can view).
export async function GET(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  if (!isAdminConfigured) {
    return NextResponse.json({ message: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

// POST — create a product (requires the elevated passcode session).
export async function POST(request) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }
  if (!isAdminConfigured) {
    return NextResponse.json({ message: "Supabase not configured" }, { status: 500 });
  }

  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
