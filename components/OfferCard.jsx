"use client";

import { useState } from "react";
import { BadgePercent, Copy, Check } from "lucide-react";
import { activeOffer } from "@/lib/data";

/**
 * Coupon / offer card shown on the product page.
 *
 * Colour is controlled entirely by the classes below — swap the
 * "amber" family for any other Tailwind colour (e.g. "blue", "rose")
 * to re-theme it in seconds. Keep the pattern:
 *   background: from-50 via-50 to-100
 *   border: 200
 *   accent text/icon: 600 or 700
 * See NON_CODER_GUIDE.md for the full step-by-step version of this note.
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

      {/* ---- FADED GOLD GRADIENT CARD ---- */}
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border border-amber-200 rounded-xl px-4 py-4">
        <div className="flex items-start gap-2.5">
          <BadgePercent size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-700 font-medium text-sm">
              Get it for as low as ₹{bulkPrice}{" "}
              <span className="text-graphite line-through font-normal">
                ₹{product.price}
              </span>
            </p>
            <p className="text-[13px] font-normal text-graphite mt-1">
              {activeOffer.bulkLabel}
            </p>
            <p className="text-[13px] font-light text-graphite">{activeOffer.subLabel}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-amber-200 my-3" />

        <div className="flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm font-medium text-ink"
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
            className="text-[13px] font-normal text-graphite underline underline-offset-2"
          >
            Offer T&C
          </a>
        </div>
      </div>
    </div>
  );
}
