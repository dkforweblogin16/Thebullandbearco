// FILE PATH: app/collection/[slug]/loading.jsx

// Instant skeleton shown by Next.js during server-side navigation to a
// /collection/[slug] route, before the page component is ready.
export default function CollectionLoading() {
  return (
    <div className="pb-16">
      <div className="relative h-40 bg-ink animate-pulse" />
      <div className="flex gap-2 px-4 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-16 shrink-0 rounded-full bg-mist animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] bg-mist rounded-xl" />
            <div className="h-3.5 w-3/4 bg-mist rounded mt-2" />
            <div className="h-3.5 w-1/2 bg-mist rounded mt-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
