// FILE PATH: app/account/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Mail, Smartphone, LogOut, Package, Heart, MapPin, ChevronRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { fetchOrdersForUser } from "@/lib/orders";
import { useWishlist } from "@/store/useWishlist";

// ---------------------------------------------------------------------
// Real Supabase Auth (email + password) is wired up below.
// Phone/OTP UI is present but shows "Coming soon" until a paid SMS
// provider (Twilio etc.) is connected in the Supabase dashboard under
// Authentication -> Providers -> Phone.
// ---------------------------------------------------------------------

export default function AccountPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [method, setMethod] = useState("email"); // "phone" | "email"
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [orderCount, setOrderCount] = useState(null);
  const wishlistCount = useWishlist((s) => s.ids.length);

  useEffect(() => {
    if (!user) {
      setOrderCount(null);
      return;
    }
    fetchOrdersForUser(user.id).then((data) => setOrderCount(data.length));
  }, [user]);

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
        options: { data: { full_name: name, phone } },
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
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/"); // logged in -> go straight to the storefront
        return;
      }
    }

    setSubmitting(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // ---- Already logged in ----
  if (!loading && user) {
    const displayName =
      profile?.full_name || user.user_metadata?.full_name || "";
    const initial = (displayName || user.email || "?").charAt(0).toUpperCase();
    const memberSince = user.created_at
      ? new Date(user.created_at).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        })
      : null;

    return (
      <div className="min-h-[calc(100vh-8rem)] bg-mist px-5 pt-6 pb-10">
        <div className="w-full max-w-sm mx-auto">
          {/* Profile card */}
          <div className="rounded-2xl overflow-hidden shadow-xl mb-5">
            <div className="bg-ink px-6 pt-7 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-paper text-ink flex items-center justify-center text-2xl font-display font-bold shadow-lg mx-auto mb-3">
                {initial}
              </div>
              <p className="text-paper/60 text-xs tracking-wide uppercase mb-1">
                Welcome back
              </p>
              <p className="font-display font-bold text-lg text-paper break-all">
                {displayName || user.email || user.phone}
              </p>
              {displayName && (user.email || user.phone) && (
                <p className="text-paper/50 text-xs mt-0.5 break-all">
                  {user.email || user.phone}
                </p>
              )}
              {memberSince && (
                <p className="text-paper/40 text-[11px] mt-2">
                  Member since {memberSince}
                </p>
              )}
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 bg-paper">
              <Link
                href="/orders"
                className="flex flex-col items-center py-4 border-r border-line"
              >
                <span className="font-display font-bold text-xl text-ink">
                  {orderCount === null ? "–" : orderCount}
                </span>
                <span className="text-graphite text-xs mt-0.5">Orders</span>
              </Link>
              <Link href="/wishlist" className="flex flex-col items-center py-4">
                <span className="font-display font-bold text-xl text-ink">
                  {wishlistCount}
                </span>
                <span className="text-graphite text-xs mt-0.5">Wishlist</span>
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-paper rounded-2xl shadow-sm divide-y divide-line mb-5 overflow-hidden">
            <Link
              href="/orders"
              className="flex items-center gap-3 px-5 py-4 active:bg-mist"
            >
              <Package size={18} className="text-ink" />
              <span className="flex-1 text-sm font-medium text-ink">
                My Orders
              </span>
              <ChevronRight size={16} className="text-graphite" />
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-5 py-4 active:bg-mist"
            >
              <Heart size={18} className="text-ink" />
              <span className="flex-1 text-sm font-medium text-ink">
                Wishlist
              </span>
              <ChevronRight size={16} className="text-graphite" />
            </Link>
            <Link
              href="/track-order"
              className="flex items-center gap-3 px-5 py-4 active:bg-mist"
            >
              <MapPin size={18} className="text-ink" />
              <span className="flex-1 text-sm font-medium text-ink">
                Track an Order
              </span>
              <ChevronRight size={16} className="text-graphite" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-3.5 rounded-xl font-semibold active:scale-[0.98] transition-transform"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
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
       The Bull &amp; Bear Co.
      </p>
      <p className="text-paper/60 text-xs tracking-wide mb-8">
        Powered by FaujiWhoTrades
      </p>

  

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
            {mode === "signup" && (
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Mobile Number"
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
          <Link href="/privacy" className="underline text-ink">Privacy Policy</Link> &{" "}
          <Link href="/terms" className="underline text-ink">Terms of Service</Link>
        </p>
      </div>
    </div>
  );
            }
      
