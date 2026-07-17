// FILE PATH: components/admin/ChipInput.jsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

// Type a value + press Enter (or comma) to add it as a chip.
// Used for tags and sizes in the product form -- no comma-string typing.
export default function ChipInput({ values, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  function commit() {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  }

  function removeAt(i) {
    const next = [...values];
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <div className="w-full border border-line rounded-lg px-2 py-2 flex flex-wrap gap-1.5">
      {values.map((v, i) => (
        <span
          key={v + i}
          className="flex items-center gap-1 bg-mist text-xs font-medium text-ink px-2 py-1 rounded-full"
        >
          {v}
          <button type="button" onClick={() => removeAt(i)}>
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={placeholder}
        className="flex-1 min-w-[80px] text-sm outline-none py-1"
      />
    </div>
  );
}

