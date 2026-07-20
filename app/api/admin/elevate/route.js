// FILE PATH: app/api/admin/elevate/route.js
import { NextResponse } from "next/server";
import { requireAdmin, elevatedCookieValue } from "@/lib/adminAuth";

// GET — used by the admin dashboard on load to silently check whether
// this browser already holds a valid elevated session (so we don't nag
// the admin for the passcode every single page load).
export async function GET(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  const cookie = request.cookies.get("admin_elevated")?.value;
  const elevated = Boolean(cookie && cookie === elevatedCookieValue());
  return NextResponse.json({ elevated });
}

// POST { passcode } — unlocks full control (add/edit/delete) for 8 hours.
export async function POST(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }

  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json(
      { message: "ADMIN_PASSCODE is not set on the server. Add it in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { passcode } = await request.json().catch(() => ({}));
  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ message: "Incorrect passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ elevated: true });
  res.cookies.set("admin_elevated", elevatedCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

// DELETE — locks full control again (e.g. "Lock" button, or logging out).
export async function DELETE(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json({ message: check.message }, { status: check.status });
  }
  const res = NextResponse.json({ elevated: false });
  res.cookies.delete("admin_elevated");
  return res;
}

