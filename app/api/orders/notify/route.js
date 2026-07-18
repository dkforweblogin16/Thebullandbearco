// FILE PATH: app/api/orders/notify/route.js
import { NextResponse } from "next/server";
import { sendEmail, adminEmail } from "@/lib/email";

export async function POST(request) {
  const { orderNumber, name, email, total, items } = await request.json();
  if (!orderNumber) {
    return NextResponse.json({ message: "Missing order number." }, { status: 400 });
  }

  const itemsHtml = (items || [])
    .map((i) => `<li>${i.qty} × ${i.name}${i.size ? ` (${i.size})` : ""} — ₹${i.price}</li>`)
    .join("");

  if (email) {
    await sendEmail({
      to: email,
      subject: `Order Confirmed — ${orderNumber}`,
      html: `<p>Hi ${name || "there"},</p><p>Your order <strong>${orderNumber}</strong> is confirmed!</p><ul>${itemsHtml}</ul><p><strong>Total: ₹${total}</strong></p><p>We'll email you again once it ships.</p><p>— The Bull &amp; Bear Co.</p>`,
    });
  }

  if (adminEmail()) {
    await sendEmail({
      to: adminEmail(),
      subject: `New Order — ${orderNumber} (₹${total})`,
      html: `<p>New order from ${name || "a customer"} (${email || "no email given"}).</p><ul>${itemsHtml}</ul><p><strong>Total: ₹${total}</strong></p>`,
    });
  }

  return NextResponse.json({ ok: true });
}

