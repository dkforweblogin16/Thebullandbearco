"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search } from "lucide-react";
import Link from "next/link";
import { useUI } from "@/store/useUI";
import { products } from "@/lib/data";

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-paper flex flex-col"
        >
          <div className="flex items-center gap-2 px-4 h-16 border-b border-line shrink-0">
            <Search size={18} className="text-graphite" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for tees, polos, joggers..."
              className="flex-1 text-sm outline-none"
            />
            <button
              onClick={() => {
                closeSearch();
                setQuery("");
              }}
              className="p-2 -mr-2"
              aria-label="Close search"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {query.trim() === "" && (
              <p className="text-sm text-graphite">
                Try "tee", "polo", "joggers" or "co-ord".
              </p>
            )}
            {query.trim() !== "" && results.length === 0 && (
              <p className="text-sm text-graphite">
                No matches for "{query}". Try another search.
              </p>
            )}
            <div className="space-y-4">
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  onClick={() => {
                    closeSearch();
                    setQuery("");
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-14 h-16 bg-mist shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-graphite tabular">
                      ₹{p.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
