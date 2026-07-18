// FILE PATH: lib/contact.js
export async function submitContactMessage({ name, email, message }) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Couldn't send your message.");
  return data;
}
