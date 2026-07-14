import { Star } from "lucide-react";

export const metadata = { title: "Reviews | The Bull & Bear Co." };

const reviews = [
  { name: "Arjun R.", rating: 5, text: "Fabric quality is unmatched. Wore the Bull Run tee to a trading meetup and got asked where it's from." },
  { name: "Priya S.", rating: 4, text: "Oversized fit is exactly as shown. Sizing chart is accurate." },
  { name: "Kabir M.", rating: 5, text: "Fast delivery, and the co-ord set is genuinely comfortable for travel." },
];

export default function ReviewsPage() {
  return (
    <div className="px-4 pt-8 pb-10">
      <h1 className="font-display font-black text-2xl text-center mb-6">
        Customer Reviews
      </h1>
      <div className="space-y-4 max-w-md mx-auto">
        {reviews.map((r) => (
          <div key={r.name} className="border border-line rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-sm">{r.name}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={13} className="fill-gold text-gold" />
                ))}
              </div>
            </div>
            <p className="text-sm text-graphite leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

