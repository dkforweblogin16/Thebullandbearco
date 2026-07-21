// FILE PATH: components/admin/ImageUploader.jsx
"use client";

import { useRef, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Upload, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

// A drop-in multi-image uploader. Give it the current `images` array
// (list of public URLs) and it calls onChange with the updated array
// after every upload / remove / reorder.
export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const json = await adminFetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        uploaded.push(json.url);
      }
      onChange([...(images || []), ...uploaded]);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(i) {
    const next = [...images];
    next.splice(i, 1);
    onChange(next);
  }

  function move(i, dir) {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(images || []).map((url, i) => (
          <div key={url + i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-line group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
              <button type="button" onClick={() => move(i, -1)} className="text-paper">
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="text-paper">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => removeAt(i)} className="text-paper">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 rounded-lg border border-dashed border-line flex flex-col items-center justify-center text-graphite text-xs gap-1 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "..." : "Add"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
      {error && <p className="text-red text-xs">{error}</p>}
    </div>
  );
}

