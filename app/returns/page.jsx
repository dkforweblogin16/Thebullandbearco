export const metadata = { title: "Return & Exchange | The Bull & Bear Co." };

const steps = [
  "Go to My Account → Orders and select the item.",
  "Choose Return or Exchange and pick a reason.",
  "Schedule a free pickup from your address.",
  "Refund or replacement is processed within 5–7 business days.",
];

export default function ReturnsPage() {
  return (
    <div className="px-4 pt-8 pb-10 max-w-md mx-auto">
      <h1 className="font-display font-black text-2xl text-center mb-2">
        Return &amp; Exchange
      </h1>
      <p className="text-graphite text-sm text-center mb-6">
        7-day easy returns on all unworn, tagged items.
      </p>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="shrink-0 w-6 h-6 rounded-full bg-ink text-paper text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-graphite leading-relaxed">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
