// FILE PATH: app/api/admin/messages/[id]/reply/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export async function POST(request, { params }) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }

  const { reply } = await request.json();
  if (!reply) {
    return NextResponse.json({ message: "Reply text is required." }, { status: 400 });
  }

  const { data: msg, error: fetchError } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .eq("id", params.id)
    .single();
  if (fetchError || !msg) {
    return NextResponse.json({ message: "Message not found." }, { status: 404 });
  }

  await sendEmail({
    to: msg.email,
    subject: "Re: Your message to The Bull & Bear Co.",
    html: `<p>Hi ${msg.name},</p><p>${reply.replace(/\n/g, "<br/>")}</p><p>— The Bull &amp; Bear Co. Team</p>`,
  });

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .update({ is_read: true, replied_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}

