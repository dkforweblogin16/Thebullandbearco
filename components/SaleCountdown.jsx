"use client";

import { useEffect, useState } from "react";
import { activeOffer } from "@/lib/data";

function formatPart(n) {
  return String(n).padStart(2, "0");
}

export default function SaleCountdown() {
  // Target time is set once, the first time this page loads in the browser.
  const [target] = useState(
    () => Date.now() + activeOffer.saleDurationHours * 60 * 60 * 1000
  );
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(target - Date.now(), 0));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="mt-3 bg-green/10 rounded-lg py-2.5 text-center">
      <span className="text-sm text-ink">
        Sale ends in :{" "}
        <span className="font-bold tabular">
          {formatPart(hours)}h : {formatPart(minutes)}m : {formatPart(seconds)}s
        </span>
      </span>
    </div>
  );
}

