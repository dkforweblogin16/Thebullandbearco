import Link from "next/link";

export default function PosterBanner({ poster }) {
  return (
    <Link
      href={poster.href}
      className="col-span-2 block relative aspect-[4/3] overflow-hidden bg-mist active:opacity-90 transition-opacity"
    >
      <img
        src={poster.image}
        alt={poster.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 text-paper">
        <h3 className="font-display font-bold text-2xl leading-tight mb-1">
          {poster.title}
        </h3>
        <p className="text-sm text-paper/85">{poster.subtitle}</p>
      </div>
    </Link>
  );
}
