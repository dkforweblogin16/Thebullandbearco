// FILE PATH: app/contact/ContactForm.jsx
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend wired up yet — swap this for a real API call
    // (e.g. POST to an /api/contact route, or a Supabase table) when ready.
    setSent(true);
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
      <button className="w-full bg-ink text-paper py-3.5 font-semibold tracking-wide">
        Send Message
      </button>
    </form>
  );
}

