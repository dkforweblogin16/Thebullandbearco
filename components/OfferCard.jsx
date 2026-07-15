"use client";

import { useState } from "react";
import { BadgePercent, Copy, Check } from "lucide-react";
import { activeOffer } from "@/lib/data";

/**
 * Coupon / offer card shown on the product page.
 *
 * Colour is controlled entirely by the classes below — swap the
 * "blue" family for any other Tailwind colour (e.g. "amber", "rose")
 * to re-theme it in seconds. See NON_CODER_GUIDE.md for the full
 * step-by-step version of this note.
 */
export default function OfferCard({ product }) {
  const [copied, setCopied] = useState(false);

  const bulkPrice = Math.round(
    product.price * (1 - activeOffer.bulkDiscountPercent / 100)
  );

  function handleCopy() {
    navigator.clipboard?.writeText(activeOffer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-ink mb-2">
        Save extra with these offers
      </p>

      {/* ---- FADED BLUE CARD ---- */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-4">
        <div className="flex items-start gap-2.5">
          <BadgePercent size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-700 font-bold text-sm">
              Get it for as low as ₹{bulkPrice}{" "}
              <span className="text-graphite line-through font-normal">
                ₹{product.price}
              </span>
            </p>
            <p className="text-[13px] font-semibold text-graphite mt-1">
              {activeOffer.bulkLabel}
            </p>
            <p className="text-[13px] text-graphite">{activeOffer.subLabel}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-blue-200 my-3" />

        <div className="flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm font-bold text-ink"
          >
            Code: {activeOffer.code}
            {copied ? (
              <Check size={14} className="text-green" />
            ) : (
              <Copy size={14} className="text-graphite" />
            )}
          </button>
          <a
            href={activeOffer.termsHref}
            className="text-[13px] font-medium text-graphite underline underline-offset-2"
          >
            Offer T&C
          </a>
        </div>
      </div>
    </div>
  );
}

