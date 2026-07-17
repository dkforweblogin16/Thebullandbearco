// FILE PATH: app/admin/team/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Search, ShieldCheck, Shield } from "lucide-react";

export default function AdminTeam() {
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function load() {
    setLoading(true);
    adminFetch("/api/admin/team")
      .then((res) => {
        setProfiles(res.profiles);
        setCurrentUserId(res.currentUserId);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(
    () =>
      profiles.filter((p) =>
        `${p.full_name || ""} ${p.email || ""} ${p.phone || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [profiles, search]
  );

  async function toggleAdmin(p) {
    try {
      await adminFetch(`/api/admin/team/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_admin: !p.is_admin }),
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink mb-4">Team / Admin Access</h1>
      <p className="text-sm text-graphite mb-4">
        Grant or remove admin access for any signed-up customer. You can't change your own access here.
      </p>

      <div className="flex items-center gap-2 border border-line rounded-lg px-3 py-2 bg-paper mb-4">
        <Search size={15} className="text-graphite" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-graphite text-sm">Loading...</p>
      ) : (
        <div className="bg-paper rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-graphite border-b border-line">
                <th className="p-3">Name</th>
                <th className="p-3">Email / Phone</th>
                <th className="p-3">Access</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="p-3 font-medium text-ink">
                    {p.full_name || "—"} {p.id === currentUserId && <span className="text-xs text-graphite">(you)</span>}
                  </td>
                  <td className="p-3 text-graphite">{p.email || p.phone}</td>
                  <td className="p-3">
                    {p.is_admin ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-ink">
                        <ShieldCheck size={14} /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-graphite">
                        <Shield size={14} /> Customer
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {p.id !== currentUserId && (
                      <button
                        onClick={() => toggleAdmin(p)}
                        className="text-xs font-semibold text-ink underline"
                      >
                        {p.is_admin ? "Remove admin" : "Make admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-graphite">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

