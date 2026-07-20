// FILE PATH: app/api/admin/orders/[id]/route.js
import { NextResponse } from "next/server";
import { requireElevated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

const statusMessages = {
  shipped: "Good news — your order has been shipped and is on its way!",
  delivered: "Your order has been delivered. We hope you love it!",
  cancelled: "Your order has been cancelled.",
};

export async function PATCH(request, { params }) {
  const check = await requireElevated(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message, code: check.code }, { status: check.status });
  }

  const body = await request.json(); // { order_status } and/or { payment_status }
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Email the customer whenever the order_status changes to something
  // customer-facing, as long as we have their email on file.
  const customerEmail = data.address?.email;
  if (body.order_status && statusMessages[body.order_status] && customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: `Order Update — ${data.order_number}`,
      html: `<p>Hi ${data.address?.full_name || "there"},</p><p>${statusMessages[body.order_status]}</p><p>Order: <strong>${data.order_number}</strong></p><p>— The Bull &amp; Bear Co.</p>`,
    });
  }

  return NextResponse.json({ order: data });
}

