// FILE PATH: app/api/admin/upload/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Receives a single image file as FormData, uploads it to the
// "product-images" Storage bucket using the service-role key (so no
// storage permissions ever need to be exposed to the browser), and
// returns the public URL to store in a product's `images` array.
export async function POST(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `products/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ message: uploadError.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("product-images").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path });
}

export async function DELETE(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }

  const { path } = await request.json();
  if (!path) {
    return NextResponse.json({ message: "No path provided." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.storage.from("product-images").remove([path]);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

