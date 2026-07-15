// FILE PATH: app/admin/products/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const blankForm = {
  name: "",
  price: "",
  original_price: "",
  discount_label: "",
  category: "tees",
  description: "",
  tags: "",
  sizes: "S,M,L,XL",
  images: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.status === 401) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(blankForm);
    setFormOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name,
      price: p.price,
      original_price: p.original_price || "",
      discount_label: p.discount_label || "",
      category: p.category,
      description: p.description || "",
      tags: (p.tags || []).join(", "),
      sizes: (p.sizes || []).join(","),
      images: (p.images || []).join(", "),
    });
    setFormOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : Number(form.price),
      discount_label: form.discount_label,
      category: form.category,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const res = await fetch("/api/admin/products", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not save product");
      return;
    }
    setFormOpen(false);
    loadProducts();
  }

  async function handleDelete(id) {
    if (!confirm("Retire this product? It will stop showing in the store.")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadProducts();
  }

  if (unauthorized) {
    return (
      <div className="px-6 pt-16 text-center">
        <p className="font-display font-bold text-xl text-ink mb-3">Not logged in</p>
        <Link href="/admin" className="text-ink underline text-sm">Go to admin login</Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-10">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display font-bold text-xl text-ink">Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-ink text-paper px-3 py-2 rounded-lg text-xs font-semibold"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-graphite">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-graphite">
          No products yet. Run supabase/schema.sql to seed the starter catalog, or add one above.
        </p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border border-line rounded-lg p-3">
              <img
                src={p.images?.[0]}
                alt={p.name}
                className="w-12 h-14 object-cover rounded-md bg-mist shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                <p className="text-xs text-graphite">
                  ₹{p.price} · {p.category} · {p.is_active ? "Active" : "Retired"}
                </p>
              </div>
              <button onClick={() => openEdit(p)} className="p-2 text-ink">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50" onClick={() => setFormOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-paper rounded-t-2xl max-h-[88vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-line">
              <h2 className="font-display font-bold text-xl text-ink">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setFormOpen(false)} className="w-9 h-9 rounded-full bg-ink flex items-center justify-center">
                <X size={18} className="text-paper" />
              </button>
            </div>
            <form onSubmit={handleSave} className="px-5 py-5 space-y-3">
              <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input type="number" placeholder="Original price" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              </div>
              <input placeholder="Discount label (e.g. 40% OFF)" value={form.discount_label} onChange={(e) => setForm({ ...form, discount_label: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              <input required placeholder="Category slug (e.g. tees)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              <input placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              <input placeholder="Sizes, comma separated (S,M,L,XL)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              <textarea placeholder="Image URLs, comma separated" rows={2} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none" />
              {error && <p className="text-red text-xs">{error}</p>}
              <button className="w-full bg-ink text-paper py-3.5 rounded-lg font-semibold text-sm">
                {editing ? "Save Changes" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

