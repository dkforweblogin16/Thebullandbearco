import { Banknote, Truck, Undo2 } from "lucide-react";

const features = [
  { icon: Banknote, label: "Cash On", sub: "Delivery" },
  { icon: Truck, label: "Free", sub: "Shipping" },
  { icon: Undo2, label: "Easy", sub: "Returns" },
];

export default function FeatureBar() {
  return (
    <div className="bg-mist py-5">
      <div className="flex divide-x divide-line">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="flex-1 flex flex-col items-center gap-1.5 px-2"
            >
              <Icon size={20} strokeWidth={1.75} />
              <p className="text-[11px] font-bold text-center leading-tight uppercase tracking-wide">
                {f.label}
                <br />
                {f.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
