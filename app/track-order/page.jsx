export const metadata = { title: "Track Order | The Bull & Bear Co." };

export default function TrackOrderPage() {
  return (
    <div className="px-4 pt-10 max-w-sm mx-auto text-center">
      <h1 className="font-display font-black text-2xl mb-2">Track Your Order</h1>
      <p className="text-graphite text-sm mb-6">
        Enter your order ID to check its current position.
      </p>
      <input
        type="text"
        placeholder="Order ID"
        className="w-full border border-line rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:border-ink"
      />
      <button className="w-full bg-ink text-paper py-3.5 font-semibold tracking-wide">
        Track Order
      </button>
    </div>
  );
}

