// FILE PATH: app/admin/products/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { supabase } from "@/lib/supabaseClient";
import ImageUploader from "@/components/admin/ImageUploader";
import ChipInput from "@/components/admin/ChipInput";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Download,
  Eye,
  EyeOff,
  Palette,
} from "lucide-react";

const blankForm = {
  name: "",
  price: "",
  original_price: "",
  discount_label: "",
  category: "",
  tags: [],
  images: [],
  sizes: [],
  description: "",
  stock: {}, // { size: qty }
  colors: [], // [{ name, images: [url,...] }]
  is_active: true,
};

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | product object
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | hidden
  const [selected, setSelected] = useState(new Set());

  function load() {
    setLoading(true);
    adminFetch("/api/admin/products")
      .then((res) => setProducts(res.products))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    supabase
      .from("categories")
      .select("slug, label")
      .then(({ data }) => setCategories(data || []));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (statusFilter === "active" && !p.is_active) return false;
      if (statusFilter === "hidden" && p.is_active) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  function openNew() {
    setForm(blankForm);
    setError("");
    setEditing("new");
  }

  function openEdit(p) {
    setForm({
      name: p.name || "",
      price: p.price ?? "",
      original_price: p.original_price ?? "",
      discount_label: p.discount_label || "",
      category: p.category || "",
      tags: p.tags || [],
      images: p.images || [],
      sizes: p.sizes || [],
      description: p.description || "",
      stock: p.stock || {},
      colors: p.colors || [],
      is_active: p.is_active,
    });
    setError("");
    setEditing(p);
  }

  function updateStockFor(size, qty) {
    setForm((f) => ({ ...f, stock: { ...f.stock, [size]: Number(qty) || 0 } }));
  }

  function addColor() {
    setForm((f) => ({ ...f, colors: [...f.colors, { name: "", images: [] }] }));
  }

  function updateColor(i, patch) {
    setForm((f) => {
      const next = [...f.colors];
      next[i] = { ...next[i], ...patch };
      return { ...f, colors: next };
    });
  }

  function removeColor(i) {
    setForm((f) => {
      const next = [...f.colors];
      next.splice(i, 1);
      return { ...f, colors: next };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      discount_label: form.discount_label,
      category: form.category,
      tags: form.tags,
      images: form.images,
      sizes: form.sizes,
      description: form.description,
      stock: form.stock,
      colors: form.colors.map((c) => ({
        name: c.name,
        images: c.images,
        swatch: c.images?.[0] || "",
      })),
      is_active: form.is_active,
    };

    try {
      if (editing === "new") {
        await adminFetch("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await adminFetch(`/api/admin/products/${editing.id}`, {
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

  async function handleDelete(p) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    try {
      await adminFetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleActive(p) {
    try {
      await adminFetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  function toggleSelect(id) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function bulkSetActive(active) {
    try {
      await Promise.all(
        [...selected].map((id) =>
          adminFetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ is_active: active }),
          })
        )
      );
      setSelected(new Set());
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.size} selected product(s)? This can't be undone.`)) return;
    try {
      await Promise.all(
        [...selected].map((id) => adminFetch(`/api/admin/products/${id}`, { method: "DELETE" }))
      );
      setSelected(new Set());
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  function exportCsv() {
    const rows = filtered.map((p) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      original_price: p.original_price,
      is_active: p.is_active,
      sizes: (p.sizes || []).join("|"),
      stock: JSON.stringify(p.stock || {}),
    }));
    downloadCsv("products.csv", toCsv(rows));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="font-display font-bold text-2xl text-ink">Products</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 border border-line px-3 py-2.5 rounded-lg text-sm font-semibold text-ink"
          >
            <Download size={15} /> Export
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 border border-line rounded-lg px-3 py-2 bg-paper flex-1 min-w-[180px]">
          <Search size={15} className="text-graphite" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="text-sm outline-none flex-1"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-line rounded-lg px-3 py-2 text-sm bg-paper"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-line rounded-lg px-3 py-2 text-sm bg-paper"
        >
          <option value="all">All status</option>
          <option value="active">Active only</option>
          <option value="hidden">Hidden only</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 mb-3 bg-mist border border-line rounded-lg px-3 py-2 text-sm">
          <span className="font-semibold text-ink">{selected.size} selected</span>
          <button onClick={() => bulkSetActive(true)} className="text-green font-medium ml-2">
            Activate
          </button>
          <button onClick={() => bulkSetActive(false)} className="text-graphite font-medium">
            Hide
          </button>
          <button onClick={bulkDelete} className="text-red font-medium">
            Delete
          </button>
        </div>
      )}

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-graphite text-sm">Loading...</p>
      ) : (
        <div className="bg-paper rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-graphite border-b border-line">
                <th className="p-3 w-8"></th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const totalStock = Object.values(p.stock || {}).reduce((a, b) => a + Number(b || 0), 0);
                return (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td className="p-3 font-medium text-ink flex items-center gap-2">
                      {p.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                      )}
                      {p.name}
                      {p.colors?.length > 0 && <Palette size={13} className="text-graphite" />}
                    </td>
                    <td className="p-3 text-graphite">{p.category}</td>
                    <td className="p-3 text-graphite">₹{p.price}</td>
                    <td className={`p-3 ${totalStock === 0 ? "text-red font-semibold" : "text-graphite"}`}>
                      {totalStock}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold ${
                          p.is_active ? "bg-green/15 text-green" : "bg-graphite/15 text-graphite"
                        }`}
                      >
                        {p.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {p.is_active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(p)} className="text-graphite">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(p)} className="text-red">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-graphite">
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/40 flex items-end md:items-center justify-center z-50 p-0 md:p-6">
          <form
            onSubmit={handleSave}
            className="bg-paper w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl p-5 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-ink">
                {editing === "new" ? "Add Product" : "Edit Product"}
              </h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X size={20} className="text-graphite" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-graphite">Product Photos</label>
                <div className="mt-1">
                  <ImageUploader
                    images={form.images}
                    onChange={(images) => setForm({ ...form, images })}
                  />
                </div>
              </div>

              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Original Price (MRP)"
                  value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm"
                />
              </div>

              <input
                placeholder="Discount label e.g. 45% OFF"
                value={form.discount_label}
                onChange={(e) => setForm({ ...form, discount_label: e.target.value })}
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              />

              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>

              <div>
                <label className="text-xs font-semibold text-graphite">Tags</label>
                <div className="mt-1">
                  <ChipInput
                    values={form.tags}
                    onChange={(tags) => setForm({ ...form, tags })}
                    placeholder="Type a tag, press Enter"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-graphite">Sizes</label>
                <div className="mt-1">
                  <ChipInput
                    values={form.sizes}
                    onChange={(sizes) => setForm({ ...form, sizes })}
                    placeholder="e.g. S, M, L -- press Enter"
                  />
                </div>
              </div>

              {form.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-graphite">Stock per size</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {form.sizes.map((s) => (
                      <div key={s} className="flex items-center gap-2 border border-line rounded-lg px-2 py-1.5">
                        <span className="text-xs font-semibold text-ink w-8">{s}</span>
                        <input
                          type="number"
                          value={form.stock[s] ?? ""}
                          onChange={(e) => updateStockFor(s, e.target.value)}
                          className="w-full text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              />

              <div className="border-t border-line pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-graphite">Color Variants (optional)</label>
                  <button
                    type="button"
                    onClick={addColor}
                    className="text-xs font-semibold text-ink underline"
                  >
                    + Add Color
                  </button>
                </div>
                {form.colors.map((c, i) => (
                  <div key={i} className="border border-line rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        placeholder="Color name e.g. Navy"
                        value={c.name}
                        onChange={(e) => updateColor(i, { name: e.target.value })}
                        className="flex-1 border border-line rounded-lg px-3 py-2 text-sm"
                      />
                      <button type="button" onClick={() => removeColor(i)} className="text-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <ImageUploader
                      images={c.images}
                      onChange={(images) => updateColor(i, { images })}
                    />
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                Active (visible on storefront)
              </label>
            </div>

            {error && <p className="text-red text-xs mt-3">{error}</p>}

            <button
              disabled={saving}
              className="w-full bg-ink text-paper py-3 rounded-lg font-semibold 
