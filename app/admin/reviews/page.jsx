// FILE PATH: app/admin/reviews/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Trash2, Star, Search, Check, X as XIcon } from "lucide-react";
import { products } from "@/lib/data";

function productName(productId) {
  const match = products.find((p) => String(p.id) === String(productId));
  return match?.name || `Product #${productId}`;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending"); // pending | approved | all

  function load() {
    setLoading(true);
    adminFetch("/api/admin/reviews")
      .then((res) => setReviews(res.reviews))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (filter === "pending" && r.is_approved) return false;
      if (filter === "approved" && !r.is_approved) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${r.reviewer_name} ${productName(r.product_id)} ${r.comment || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [reviews, search, filter]);

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  async function setApproved(r, value) {
    try {
      await adminFetch(`/api/admin/reviews/${r.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_approved: value }),
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(r) {
    if (!confirm("Delete this review?")) return;
    try {
      await adminFetch(`/api/admin/reviews/${r.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink mb-4">
        Reviews {pendingCount > 0 && <span className="text-sm font-normal text-gold">({pendingCount} pending)</span>}
      </h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["pending", "approved", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              filter === f ? "bg-ink text-paper border-ink" : "border-line text-graphite"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border border-line rounded-lg px-3 py-2 bg-paper mb-4">
        <Search size={15} className="text-graphite" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, reviewer, or comment..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-graphite text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-graphite text-sm">No reviews here.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-paper border border-line rounded-xl p-4 flex justify-between gap-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.rating ? "text-gold fill-gold" : "text-line"}
                    />
                  ))}
                  {!r.is_approved && (
                    <span className="text-[10px] font-semibold text-gold ml-2 bg-gold/15 px-1.5 py-0.5 rounded-full">
                      PENDING
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink font-medium">{r.reviewer_name}</p>
                <p className="text-xs text-graphite mb-1">{productName(r.product_id)}</p>
                {r.comment && <p className="text-sm text-graphite">{r.comment}</p>}
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                {!r.is_approved ? (
                  <button onClick={() => setApproved(r, true)} className="text-green">
                    <Check size={18} />
                  </button>
                ) : (
                  <button onClick={() => setApproved(r, false)} className="text-graphite">
                    <XIcon size={18} />
                  </button>
                )}
                <button onClick={() => handleDelete(r)} className="text-red">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
