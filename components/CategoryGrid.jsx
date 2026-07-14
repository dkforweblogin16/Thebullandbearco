import Image from "next/image";
import Link from "next/link";
import { collections } from "@/lib/data";

export default function CategoryGrid() {
  return (
    <section className="px-4 py-10">
      <h2 className="font-display font-bold text-2xl text-center mb-6">
        Shop by Collection
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {collections.map((c) => (
          <Link
            key={c.slug}
            href={`/collection/${c.slug}`}
            className="group block active:scale-[0.97] transition-transform"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-mist">
              <Image
                src={c.image}
                alt={c.label}
                fill
                sizes="50vw"
                className="object-cover group-active:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center mt-2 text-sm font-medium">{c.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
