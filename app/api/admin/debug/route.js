// FILE PATH: app/api/admin/debug/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabaseAdmin";

// TEMPORARY troubleshooting route. Reports exactly which step of the
// admin check succeeds/fails for the CURRENT signed-in user only — no
// secrets, no other users' data. Safe to leave in, or delete once the
// "Not authorized" issue is resolved.
export async function GET(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  const report = {
    step1_serviceRoleKeyPresent: isAdminConfigured,
    step2_tokenReceived: Boolean(token),
  };

  if (!isAdminConfigured) {
    report.diagnosis = "SUPABASE_SERVICE_ROLE_KEY is missing on the server.";
    return NextResponse.json(report);
  }
  if (!token) {
    report.diagnosis = "No session token was sent — you may not be signed in.";
    return NextResponse.json(report);
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  report.step3_sessionValid = !userError && Boolean(userData?.user);
  report.userId = userData?.user?.id || null;
  report.userEmail = userData?.user?.email || null;
  report.step3_error = userError?.message || null;

  if (!report.step3_sessionValid) {
    report.diagnosis = "Your session token isn't valid — try signing out and back in.";
    return NextResponse.json(report);
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, email, is_admin")
    .eq("id", userData.user.id)
    .maybeSingle();

  report.step4_profileRowFound = Boolean(profile);
  report.step4_isAdminValue = profile?.is_admin ?? null;
  report.step4_error = profileError?.message || null;

  if (profileError) {
    report.diagnosis =
      "The profiles query itself errored — this usually means SUPABASE_SERVICE_ROLE_KEY is invalid, or is actually the anon key instead of the service_role secret (RLS blocked the read).";
  } else if (!profile) {
    report.diagnosis =
      "getUser succeeded, but no matching row exists in 'profiles' for this user id via the service-role client. Either the row doesn't exist, or SUPABASE_SERVICE_ROLE_KEY points at a different Supabase project than NEXT_PUBLIC_SUPABASE_URL.";
  } else if (!profile.is_admin) {
    report.diagnosis = "Profile found, but is_admin is not true in the database for this exact row.";
  } else {
    report.diagnosis = "Everything checks out — is_admin is true via the service-role client. If you're still seeing 'Not authorized', the deployed code may be stale — redeploy.";
  }

  return NextResponse.json(report);
}

