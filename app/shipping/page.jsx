export const metadata = { title: "Shipping Policy | The Bull & Bear Co." };

const rows = [
  ["Standard Delivery", "4–7 business days"],
  ["Express Delivery", "2–3 business days (select cities)"],
  ["Shipping Fee", "Free on orders above ₹999"],
  ["Order Tracking", "Available via Track Order once shipped"],
];

export default function ShippingPage() {
  return (
    <div className="px-4 pt-10 pb-10 max-w-md mx-auto">
      <h1 className="font-display font-bold text-2xl text-center mb-6 text-ink">
        Shipping Policy
      </h1>
      <div className="border border-line rounded-xl overflow-hidden">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`flex justify-between px-4 py-3 text-sm ${
              i !== rows.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <span className="text-graphite">{label}</span>
            <span className="text-ink font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
      <p className="text-graphite text-sm leading-relaxed mt-6">
        We currently ship across India. International shipping is not yet
        available.
      </p>
    </div>
  );
}

