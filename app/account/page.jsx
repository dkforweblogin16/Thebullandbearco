"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function AccountPage() {
  const [phone, setPhone] = useState("");

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
        Powered by TraderPass
      </p>

      <h1 className="text-paper text-xl font-semibold text-center leading-snug mb-8 max-w-xs">
        Join the Bull &amp; Bear family for a delightful shopping experience
      </h1>

      <div className="w-full max-w-sm bg-paper rounded-2xl px-5 py-7 shadow-xl">
        <h2 className="font-display font-bold text-xl text-ink text-center mb-1">
          Delighted to have you!
        </h2>
        <p className="text-graphite text-sm text-center mb-6">
          Enter your mobile number to Login/Signup.
        </p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex border border-line rounded-lg overflow-hidden">
            <span className="flex items-center gap-1.5 px-3 bg-mist text-sm font-medium text-ink border-r border-line">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile Number"
              className="flex-1 px-3 py-3 text-sm outline-none"
            />
          </div>
          <button className="w-full bg-ink text-paper py-3.5 rounded-lg font-semibold tracking-wide active:scale-[0.98] transition-transform">
            Submit
          </button>
        </form>

        <p className="text-[11px] text-graphite text-center mt-5 leading-relaxed">
          By logging in, you're agreeing to our{" "}
          <span className="underline text-ink">Privacy Policy</span>{" "}
          <span className="underline text-ink">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}

