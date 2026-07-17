// FILE PATH: app/admin/settings/page.jsx
"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Save } from "lucide-react";

const defaults = {
  announcement_bar: { text: "", enabled: true },
  coupon_offer: {
    code: "",
    discount_type: "percent",
    discount_value: "",
    bulk_label: "",
    sub_label: "",
    sale_duration_hours: 9,
    enabled: true,
  },
  shipping: { flat_fee: 0, free_above: 999 },
  social_links: { instagram: "", facebook: "", whatsapp: "" },
  contact: { email: "", phone: "" },
};

function Section({ title, children }) {
  return (
    <div className="bg-paper border border-line rounded-xl p-4 mb-4">
      <p className="text-sm font-semibold text-ink mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-graphite">{label}</label>
      <input {...props} className="w-full border border-line rounded-lg px-3 py-2.5 text-sm mt-1" />
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/settings")
      .then((res) => setSettings({ ...defaults, ...res.settings }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function update(key, patch) {
    setSettings((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  }

  async function save(key) {
    setSaving(key);
    setError("");
    setSaved("");
    try {
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ key, value: settings[key] }),
      });
      setSaved(key);
      setTimeout(() => setSaved(""), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving("");
    }
  }

  if (loading) return <p className="text-graphite text-sm">Loading...</p>;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Site Settings</h1>
      {error && <p className="text-red text-sm mb-4">{error}</p>}

      <Section title="Announcement Bar (top strip on every page)">
        <Field
          label="Text"
          value={settings.announcement_bar.text}
          onChange={(e) => update("announcement_bar", { text: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={settings.announcement_bar.enabled}
            onChange={(e) => update("announcement_bar", { enabled: e.target.checked })}
          />
          Show announcement bar
        </label>
        <SaveButton onClick={() => save("announcement_bar")} saving={saving === "announcement_bar"} saved={saved === "announcement_bar"} />
      </Section>

      <Section title="Coupon / Offer Card (shown on product pages)">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Coupon Code"
            value={settings.coupon_offer.code}
            onChange={(e) => update("coupon_offer", { code: e.target.value.toUpperCase() })}
          />
          <Field
            label="Discount Value"
            type="number"
            value={settings.coupon_offer.discount_value}
            onChange={(e) => update("coupon_offer", { discount_value: Number(e.target.value) })}
          />
        </div>
        <Field
          label="Bold offer line"
          value={settings.coupon_offer.bulk_label}
          onChange={(e) => update("coupon_offer", { bulk_label: e.target.value })}
        />
        <Field
          label="Sub-text"
          value={settings.coupon_offer.sub_label}
          onChange={(e) => update("coupon_offer", { sub_label: e.target.value })}
        />
        <Field
          label="Countdown duration (hours)"
          type="number"
          value={settings.coupon_offer.sale_duration_hours}
          onChange={(e) => update("coupon_offer", { sale_duration_hours: Number(e.target.value) })}
        />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={settings.coupon_offer.enabled}
            onChange={(e) => update("coupon_offer", { enabled: e.target.checked })}
          />
          Show offer card on product pages
        </label>
        <SaveButton onClick={() => save("coupon_offer")} saving={saving === "coupon_offer"} saved={saved === "coupon_offer"} />
      </Section>

      <Section title="Shipping">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Flat shipping fee (₹)"
            type="number"
            value={settings.shipping.flat_fee}
            onChange={(e) => update("shipping", { flat_fee: Number(e.target.value) })}
          />
          <Field
            label="Free shipping above (₹)"
            type="number"
            value={settings.shipping.free_above}
            onChange={(e) => update("shipping", { free_above: Number(e.target.value) })}
          />
        </div>
        <SaveButton onClick={() => save("shipping")} saving={saving === "shipping"} saved={saved === "shipping"} />
      </Section>

      <Section title="Social Links">
        <Field
          label="Instagram URL"
          value={settings.social_links.instagram}
          onChange={(e) => update("social_links", { instagram: e.target.value })}
        />
        <Field
          label="Facebook URL"
          value={settings.social_links.facebook}
          onChange={(e) => update("social_links", { facebook: e.target.value })}
        />
        <Field
          label="WhatsApp number"
          value={settings.social_links.whatsapp}
          onChange={(e) => update("social_links", { whatsapp: e.target.value })}
        />
        <SaveButton onClick={() => save("social_links")} saving={saving === "social_links"} saved={saved === "social_links"} />
      </Section>

      <Section title="Contact Info">
        <Field
          label="Support Email"
          value={settings.contact.email}
          onChange={(e) => update("contact", { email: e.target.value })}
        />
        <Field
          label="Support Phone"
          value={settings.contact.phone}
          onChange={(e) => update("contact", { phone: e.target.value })}
        />
        <SaveButton onClick={() => save("contact")} saving={saving === "contact"} saved={saved === "contact"} />
      </Section>
    </div>
  );
}

function SaveButton({ onClick, saving, saved }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
    >
      <Save size={14} />
      {saving ? "Saving..." : saved ? "Saved!" : "Save"}
    </button>
  );
}

