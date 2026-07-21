// FILE PATH: app/api/admin/team/[id]/route.js
import { NextResponse } from "next/server";
import { requireElevated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Toggles someone's is_admin flag. An admin can never remove their own
// admin access here -- prevents accidentally locking yourself out.
export async function PATCH(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }

  if (params.id === check.user.id) {
    return NextResponse.json(
      { message: "You can't change your own admin access." },
      { status: 400 }
    );
  }

  const { is_admin } = await request.json();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ is_admin })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

