// FILE PATH: app/account/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Mail, Smartphone, LogOut } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";

// ---------------------------------------------------------------------
// Real Supabase Auth (email + password) is wired up below.
// Phone/OTP UI is present but shows "Coming soon" until a paid SMS
// provider (Twilio etc.) is connected in the Supabase dashboard under
// Authentication -> Providers -> Phone.
// ---------------------------------------------------------------------

export default function AccountPage() {
  const { user, loading } = useAuth();

  const [method, setMethod] = useState("email"); // "phone" | "email"
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!isSupabaseConfigured) {
      setError(
        "Supabase isn't connected yet on this deployment (missing env vars)."
      );
      return;
    }

    setSubmitting(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setInfo("Account created! Check your email to confirm, then log in.");
        setMode("login");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) setError(signInError.message);
    }

    setSubmitting(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // ---- Already logged in ----
  if (!loading && user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-graphite text-sm mb-1">Logged in as</p>
        <p className="font-display font-bold text-xl text-ink mb-6">
          {user.email || user.phone}
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded-lg font-semibold"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-8rem)] flex flex-col items-center px-6 pt-8 pb-10"
      style={{
        background:
          "linear-gradient(180deg, #101a3d 0%, #1D2B53 45%, #3a4f9e 100%)",
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
        Powered by TraderPass
      </p>

      <h1 className="text-paper text-xl font-semibold text-center leading-snug mb-8 max-w-xs">
        Join the Bull &amp; Bear family for a delightful shopping experience
      </h1>

      <div className="w-full max-w-sm bg-paper rounded-2xl px-5 py-7 shadow-xl">
        <h2 className="font-display font-bold text-xl text-ink text-center mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-graphite text-sm text-center mb-5">
          {mode === "login"
            ? "Log in to continue."
            : "Sign up to start shopping."}
        </p>

        <div className="flex border border-line rounded-lg overflow-hidden mb-4">
          <button
            type="button"
            onClick={() => setMethod("email")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold ${
              method === "email" ? "bg-ink text-paper" : "bg-paper text-graphite"
            }`}
          >
            <Mail size={15} /> Email
          </button>
          <button
            type="button"
            onClick={() => setMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold ${
              method === "phone" ? "bg-ink text-paper" : "bg-paper text-graphite"
            }`}
          >
            <Smartphone size={15} /> Phone
          </button>
        </div>

        {method === "phone" ? (
          <div className="border border-dashed border-line rounded-lg py-8 text-center">
            <p className="text-sm font-semibold text-ink mb-1">Coming soon</p>
            <p className="text-xs text-graphite px-4">
              Phone OTP login is on the way. Please use Email for now.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full border border-line rounded-lg px-4 py-3 text-sm outline-none"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full border border-line rounded-lg px-4 py-3 text-sm outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Create Password" : "Password"}
              className="w-full border border-line rounded-lg px-4 py-3 text-sm outline-none"
            />

            {error && <p className="text-red text-xs">{error}</p>}
            {info && <p className="text-green text-xs">{info}</p>}

            <button
              disabled={submitting}
              className="w-full bg-ink text-paper py-3.5 rounded-lg font-semibold tracking-wide active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              {submitting
                ? "Please wait..."
                : mode === "login"
                ? "Log In"
                : "Create Account"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-graphite mt-4">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setInfo("");
                }}
                className="text-ink font-semibold underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setInfo("");
                }}
                className="text-ink font-semibold underline"
              >
                Log In
              </button>
            </>
          )}
        </p>

        <p className="text-[11px] text-graphite text-center mt-5 leading-relaxed">
          By continuing, you're agreeing to our{" "}
          <span className="underline text-ink">Privacy Policy</span> &{" "}
          <span className="underline text-ink">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}
