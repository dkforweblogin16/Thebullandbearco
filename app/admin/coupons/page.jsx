// FILE PATH: app/admin/coupons/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Plus, Trash2, Pencil, X, Search, Copy } from "lucide-react";

const blankForm = {
  code: "",
  discount_type: "percent",
  discount_value: "",
  min_order_value: "0",
  max_uses: "",
  expires_at: "",
  active: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | coupon object
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  function load() {
    setLoading(true);
    adminFetch("/api/admin/coupons")
      .then((res) => setCoupons(res.coupons))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(
    () => coupons.filter((c) => c.code.toLowerCase().includes(search.toLowerCase())),
    [coupons, search]
  );

  function openNew() {
    setForm(blankForm);
    setError("");
    setEditing("new");
  }

  function openEdit(c) {
    setForm({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      min_order_value: c.min_order_value ?? "0",
      max_uses: c.max_uses ?? "",
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "",
      active: c.active,
    });
    setError("");
    setEditing(c);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_value: Number(form.min_order_value || 0),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
      active: form.active,
    };
    try {
      if (editing === "new") {
        await adminFetch("/api/admin/coupons", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await adminFetch(`/api/admin/coupons/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }
      setEditing(null);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c) {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      await adminFetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleActive(c) {
    try {
      await adminFetch(`/api/admin/coupons/${c.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !c.active }),
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  function copyCode(code) {
    navigator.clipboard?.writeText(code);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="font-display font-bold text-2xl text-ink">Coupons</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2.5 rounded-lg text-sm font-semibold"
        >
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="flex items-center gap-2 border border-line rounded-lg px-3 py-2 bg-paper mb-4">
        <Search size={15} className="text-graphite" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coupon code..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-graphite text-sm">Loading...</p>
      ) : (
        <div className="bg-paper rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-graphite border-b border-line">
                <th className="p-3">Code</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Used</th>
                <th className="p-3">Active</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="p-3">
                    <button
                      onClick={() => copyCode(c.code)}
                      className="flex items-center gap-1.5 font-mono font-semibold text-ink"
                    >
                      {c.code} <Copy size={12} className="text-graphite" />
                    </button>
                  </td>
                  <td className="p-3 text-graphite">
                    {c.discount_type === "percent" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  </td>
                  <td className="p-3 text-graphite">₹{c.min_order_value}</td>
                  <td className="p-3 text-graphite">
                    {c.times_used || 0}
                    {c.max_uses ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleActive(c)}
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        c.active ? "bg-green/15 text-green" : "bg-graphite/15 text-graphite"
                      }`}
                    >
                      {c.active ? "Active" : "Off"}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(c)} className="text-graphite">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(c)} className="text-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-graphite">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/40 flex items-end md:items-center justify-center z-50 p-0 md:p-6">
          <form onSubmit={handleSave} className="bg-paper w-full md:max-w-md md:rounded-2xl rounded-t-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-ink">
                {editing === "new" ? "Add Coupon" : "Edit Coupon"}
              </h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X size={20} className="text-graphite" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                required
                placeholder="Code e.g. B3G15"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm uppercase"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="percent">% off</option>
                  <option value="flat">₹ flat off</option>
                </select>
                <input
                  required
                  type="number"
                  placeholder="Value"
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min order value"
                  value={form.min_order_value}
                  onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max uses (optional)"
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Active
              </label>
            </div>
            <button
              disabled={saving}
              className="w-full bg-ink text-paper py-3 rounded-lg font-semibold mt-5 disabled:opacity-60"
            >
              {saving ? "Saving..." : editing === "new" ? "Create Coupon" : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

