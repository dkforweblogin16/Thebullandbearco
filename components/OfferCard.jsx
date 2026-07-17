// FILE PATH: components/OfferCard.jsx
"use client";

import { useEffect, useState } from "react";
import { BadgePercent, Copy, Check } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const fallback = {
  code: "B3G15",
  discount_type: "percent",
  discount_value: 15,
  bulk_label: "Buy any 3 & Get flat 15% OFF",
  sub_label: "Offer Ending Soon. Hurry!",
  sale_duration_hours: 9,
  enabled: true,
};

/**
 * Coupon / offer card shown on the product page. The text, code, and
 * discount % are now controlled from Admin Dashboard -> Settings ->
 * "Coupon / Offer Card" -- this component just reads whatever is saved
 * there (site_settings.coupon_offer). No code changes needed to update
 * the offer going forward.
 *
 * Colour is still controlled by the classes below -- swap the "blue"
 * family for any other Tailwind colour (e.g. "amber", "rose") to
 * re-theme it.
 */
export default function OfferCard({ product }) {
  const [copied, setCopied] = useState(false);
  const [offer, setOffer] = useState(fallback);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "coupon_offer")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setOffer(data.value);
      });
  }, []);

  if (!offer.enabled) return null;

  const bulkPrice =
    offer.discount_type === "flat"
      ? Math.max(product.price - Number(offer.discount_value), 0)
      : Math.round(product.price * (1 - Number(offer.discount_value) / 100));

  function handleCopy() {
    navigator.clipboard?.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-ink mb-2">
        Save extra with these offers
      </p>

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
              {offer.bulk_label}
            </p>
            <p className="text-[13px] text-graphite">{offer.sub_label}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-blue-200 my-3" />

        <div className="flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm font-bold text-ink"
          >
            Code: {offer.code}
            {copied ? (
              <Check size={14} className="text-green" />
            ) : (
              <Copy size={14} className="text-graphite" />
            )}
          </button>
          <a
            href="/terms"
            className="text-[13px] font-medium text-graphite underline underline-offset-2"
          >
            Offer T&C
          </a>
        </div>
      </div>
    </div>
  );
}
