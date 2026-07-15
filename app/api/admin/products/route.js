// FILE PATH: app/api/admin/products/route.js
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabaseAdmin";

export async function GET(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdminConfigured) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdminConfigured) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const body = await req.json();
  const slug = (body.slug || body.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({ ...body, slug })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function PATCH(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdminConfigured) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { id, ...updates } = await req.json();
  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdminConfigured) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { id } = await req.json();
  // Soft delete — keeps order history referencing this product intact.
  const { error } = await supabaseAdmin.from("products").update({ is_active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

