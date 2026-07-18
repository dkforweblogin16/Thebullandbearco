// FILE PATH: app/admin/messages/page.jsx
"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Mail, MailOpen, Trash2, Send } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  function load() {
    setLoading(true);
    adminFetch("/api/admin/messages")
      .then((res) => setMessages(res.messages))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  async function toggleRead(m) {
    try {
      await adminFetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: !m.is_read }),
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(m) {
    if (!confirm("Delete this message?")) return;
    try {
      await adminFetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function sendReply(m) {
    if (!replyText.trim()) return;
    setSending(true);
    setError("");
    try {
      await adminFetch(`/api/admin/messages/${m.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ reply: replyText }),
      });
      setReplyOpenId(null);
      setReplyText("");
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink mb-4">
        Messages {unreadCount > 0 && <span className="text-sm font-normal text-gold">({unreadCount} unread)</span>}
      </h1>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-graphite text-sm">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-graphite text-sm">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-paper border rounded-xl p-4 ${
                m.is_read ? "border-line" : "border-ink"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-graphite underline">
                    {m.email}
                  </a>
                  <p className="text-sm text-graphite mt-2 whitespace-pre-wrap">{m.message}</p>
                  <p className="text-[11px] text-graphite mt-2">
                    {new Date(m.created_at).toLocaleString()}
                    {m.replied_at && (
                      <span className="text-green ml-2">✓ Replied {new Date(m.replied_at).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end shrink-0">
                  <button onClick={() => toggleRead(m)} className="text-graphite">
                    {m.is_read ? <MailOpen size={16} /> : <Mail size={16} className="text-ink" />}
                  </button>
                  <button onClick={() => handleDelete(m)} className="text-red">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {replyOpenId === m.id ? (
                <div className="mt-3 border-t border-line pt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply — it'll be emailed to them"
                    rows={3}
                    className="w-full border border-line rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => sendReply(m)}
                      disabled={sending}
                      className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                    >
                      <Send size={14} /> {sending ? "Sending..." : "Send Reply"}
                    </button>
                    <button
                      onClick={() => {
                        setReplyOpenId(null);
                        setReplyText("");
                      }}
                      className="text-sm text-graphite px-3"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyOpenId(m.id)}
                  className="text-xs font-semibold text-ink underline mt-3"
                >
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
