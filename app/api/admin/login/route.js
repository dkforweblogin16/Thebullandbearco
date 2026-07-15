// FILE PATH: app/api/admin/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { passcode } = await req.json();

  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json(
      { error: "ADMIN_PASSCODE is not set on the server. Add it in Vercel env vars." },
      { status: 500 }
    );
  }

  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Wrong passcode" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_auth", process.env.ADMIN_PASSCODE, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

