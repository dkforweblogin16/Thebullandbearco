// FILE PATH: components/SaleCountdown.jsx
"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

function formatPart(n) {
  return String(n).padStart(2, "0");
}

export default function SaleCountdown() {
  const [hours, setHours] = useState(9); // fallback until settings load
  const [target, setTarget] = useState(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setTarget(Date.now() + hours * 60 * 60 * 1000);
      return;
    }
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "coupon_offer")
      .maybeSingle()
      .then(({ data }) => {
        const h = data?.value?.sale_duration_hours ?? hours;
        setHours(h);
        setTarget(Date.now() + h * 60 * 60 * 1000);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!target) return;
    setRemaining(target - Date.now());
    const id = setInterval(() => {
      setRemaining(Math.max(target - Date.now(), 0));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!target) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div className="mt-3 bg-green/10 rounded-lg py-2.5 text-center">
      <span className="text-sm text-ink">
        Sale ends in :{" "}
        <span className="font-bold tabular">
          {formatPart(h)}h : {formatPart(m)}m : {formatPart(s)}s
        </span>
      </span>
    </div>
  );
}

