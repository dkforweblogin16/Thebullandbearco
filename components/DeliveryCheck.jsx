// FILE PATH: components/DeliveryCheck.jsx
"use client";

import { useState } from "react";
import { MapPin, Truck, XCircle } from "lucide-react";

// Placeholder serviceability check — no courier API connected yet.
// Any valid 6-digit pincode is treated as deliverable except this short demo
// list. Swap this function for a real Shiprocket/Delhivery pincode lookup
// when you connect a logistics provider.
const UNSERVICEABLE_DEMO_PINCODES = ["854301", "796001", "744301"];

function checkServiceability(pincode) {
  if (!/^\d{6}$/.test(pincode)) return "invalid";
  if (UNSERVICEABLE_DEMO_PINCODES.includes(pincode)) return "unserviceable";
  return "serviceable";
}

export default function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState(null); // null | "serviceable" | "unserviceable" | "invalid"

  function handleChange(e) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(value);
    setStatus(value.length === 6 ? checkServiceability(value) : null);
  }

  return (
    <div className="bg-mist rounded-xl p-4 mt-4">
      <p className="font-semibold text-sm text-ink mb-3">
        Check for Delivery Details
      </p>
      <div className="flex items-center gap-2 bg-paper border border-line rounded-lg px-3 py-2.5">
        <MapPin size={16} className="text-graphite shrink-0" />
        <input
          value={pincode}
          onChange={handleChange}
          inputMode="numeric"
          placeholder="Enter pincode for delivery estimate"
          className="flex-1 text-sm outline-none"
        />
      </div>

      {status === "serviceable" && (
        <div className="flex items-center gap-2 mt-2.5 text-xs">
          <Truck size={14} className="text-green shrink-0" />
          <span className="text-ink">
            This product is eligible for <span className="text-green font-semibold">FREE SHIPPING</span> to {pincode}.
          </span>
        </div>
      )}
      {status === "unserviceable" && (
        <div className="flex items-center gap-2 mt-2.5 text-xs">
          <XCircle size={14} className="text-red shrink-0" />
          <span className="text-red font-medium">
            Not available right now in your area.
          </span>
        </div>
      )}
      {status === "invalid" && pincode.length > 0 && (
        <p className="text-xs text-red mt-2.5">Enter a valid 6-digit pincode.</p>
      )}
    </div>
  );
}

