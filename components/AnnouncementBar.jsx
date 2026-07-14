const messages = [
  "100% Refund Guarantee if you don't love the fit. Shop with Confidence.",
  "Free Shipping on orders above ₹999.",
  "New Drop: The Trader Collection is live.",
];

export default function AnnouncementBar() {
  const loop = [...messages, ...messages];
  return (
    <div className="bg-ink text-paper overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee py-2 text-xs tracking-wide font-medium">
        {loop.map((m, i) => (
          <span key={i} className="mx-6 flex items-center gap-2">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
