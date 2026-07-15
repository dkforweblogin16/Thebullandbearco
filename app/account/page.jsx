// FILE PATH: app/account/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { X, LogOut } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendOtp(e) {
    e.preventDefault();
    setError("");
    if (!isSupabaseConfigured) {
      setError("Connect Supabase (see SETUP.md) to enable real login — this is running in demo mode.");
      return;
    }
    if (phone.replace(/\D/g, "").length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
    setBusy(false);
    if (error) setError(error.message);
    else setStep("otp");
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: "sms",
    });
    setBusy(false);
    if (error) setError(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <div className="min-h-[40vh]" />;
  }

  if (user) {
    return (
      <div className="px-6 pt-14 pb-10 text-center">
        <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-ink">
          {(user.phone || "?").slice(-2)}
        </div>
        <p className="font-display font-bold text-xl text-ink mb-1">
          You're logged in
        </p>
        <p className="text-graphite text-sm mb-8">{user.phone}</p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            href="/orders"
            className="bg-ink text-paper py-3.5 rounded-lg font-semibold text-sm"
          >
            My Orders
          </Link>
          <Link
            href="/wishlist"
            className="border border-line py-3.5 rounded-lg font-semibold text-sm text-ink"
          >
            My Wishlist
          </Link>
          <button
            onClick={signOut}
            className="flex items-center justify-center gap-1.5 text-red text-sm font-medium mt-3"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-8rem)] flex flex-col items-center px-6 pt-8 pb-10"
      style={{
        background: "linear-gradient(180deg, #101a3d 0%, #1D2B53 45%, #3a4f9e 100%)",
      }}
    >
      <div className="w-full flex justify-end mb-2">
        <Link
          href="/"
          aria-label="Close"
          className="w-9 h-9 rounded-full bg-paper/15 flex items-center justify-center text-paper"
        >
          <X size={18} />
        </Link>
      </div>

      <p className="font-display font-bold text-2xl text-paper tracking-tight mb-1">
        Bull &amp; Bear Co.
      </p>
      <p className="text-paper/60 text-xs tracking-wide mb-8">
        {isSupabaseConfigured ? "Secure OTP Login" : "Demo Mode — connect Supabase for real login"}
      </p>

      <h1 className="text-paper text-xl font-semibold text-center leading-snug mb-8 max-w-xs">
        Join the Bull &amp; Bear family for a delightful shopping experience
      </h1>

      <div className="w-full max-w-sm bg-paper rounded-2xl px-5 py-7 shadow-xl">
        {step === "phone" ? (
          <>
            <h2 className="font-display font-bold text-xl text-ink text-center mb-1">
              Delighted to have you!
            </h2>
            <p className="text-graphite text-sm text-center mb-6">
              Enter your mobile number to Login/Signup.
            </p>
            <form onSubmit={sendOtp} className="space-y-4">
              <div className="flex border border-line rounded-lg overflow-hidden">
                <span className="flex items-center gap-1.5 px-3 bg-mist text-sm font-medium text-ink border-r border-line">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Mobile Number"
                  className="flex-1 px-3 py-3 text-sm outline-none"
                />
              </div>
              {error && <p className="text-red text-xs">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-ink text-paper py-3.5 rounded-lg font-semibold tracking-wide active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {busy ? "Sending..." : "Submit"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="font-display font-bold text-xl text-ink text-center mb-1">
              Enter OTP
            </h2>
            <p className="text-graphite text-sm text-center mb-6">
              Sent to +91 {phone}
            </p>
            <form onSubmit={verifyOtp} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
                className="w-full border border-line rounded-lg px-3 py-3 text-sm outline-none text-center tracking-[0.4em]"
              />
              {error && <p className="text-red text-xs">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-ink text-paper py-3.5 rounded-lg font-semibold tracking-wide active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {busy ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-graphite text-xs font-medium"
              >
                Change mobile number
              </button>
            </form>
          </>
        )}

        <p className="text-[11px] text-graphite text-center mt-5 leading-relaxed">
          By logging in, you're agreeing to our{" "}
          <Link href="/privacy" className="underline text-ink">Privacy Policy</Link>{" "}
          <Link href="/terms" className="underline text-ink">Terms of Service</Link>
        </p>
      </div>
    </div>
  );
}
