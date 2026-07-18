// FILE PATH: app/contact/ContactForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { submitContactMessage } from "@/lib/contact";

export default function ContactForm() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill name & email for a logged-in customer -- only fills
  // blank fields, never overwrites something already typed.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || profile?.full_name || "",
      email: f.email || profile?.email || user.email || "",
    }));
  }, [user, profile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitContactMessage(form);
      setSent(true);
    } catch (err) {
      setError(
        err.message || "Couldn't send your message right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-10">
        <p className="font-display font-bold text-xl text-ink mb-2">
          Message sent!
        </p>
        <p className="text-graphite text-sm">
          We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        required
        placeholder="Your Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
      />
      <input
        type="email"
        required
        placeholder="Email Address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
      />
      <textarea
        required
        placeholder="Your message"
        rows={4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
      />
      {error && <p className="text-red text-xs">{error}</p>}
      <button
        disabled={submitting}
        className="w-full bg-ink text-paper py-3.5 font-semibold tracking-wide disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
