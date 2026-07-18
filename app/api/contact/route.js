// FILE PATH: app/api/contact/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabaseAdmin";
import { sendEmail, adminEmail } from "@/lib/email";

export async function POST(request) {
  const { name, email, message } = await request.json();
  if (!name || !email || !message) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }
  if (!isAdminConfigured) {
    return NextResponse.json({ message: "Contact form isn't set up yet." }, { status: 500 });
  }

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .insert({ name, email, message });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Email notifications -- failures here never block the saved message.
  if (adminEmail()) {
    await sendEmail({
      to: adminEmail(),
      subject: `New message from ${name}`,
      html: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
    });
  }
  await sendEmail({
    to: email,
    subject: "We've received your message — The Bull & Bear Co.",
    html: `<p>Hi ${name},</p><p>Thanks for reaching out! We've received your message and will get back to you within 24 hours.</p><p>— The Bull &amp; Bear Co.</p>`,
  });

  return NextResponse.json({ ok: true });
}
