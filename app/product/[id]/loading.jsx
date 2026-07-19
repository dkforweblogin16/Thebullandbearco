// FILE PATH: app/product/[id]/loading.jsx

// Next.js shows this INSTANTLY when navigating to a /product/[id] route,
// while the server resolves generateMetadata + the page itself — this is
// what was missing and caused the blank white flash between products.
// It's swapped out automatically once the real page is ready.
export default function ProductLoading() {
  return (
    <div className="pb-24 animate-pulse">
      <div className="relative w-full aspect-[4/5] bg-mist" />
      <div className="px-4 pt-4">
        <div className="h-4 w-24 bg-mist rounded" />
        <div className="flex gap-2 mt-3 mb-3">
          <div className="h-6 w-20 bg-mist rounded-md" />
          <div className="h-6 w-24 bg-mist rounded-md" />
        </div>
        <div className="h-6 w-3/4 bg-mist rounded mt-1" />
        <div className="h-6 w-1/2 bg-mist rounded mt-4" />
        <div className="h-16 w-full bg-mist rounded-lg mt-4" />
        <div className="h-4 w-full bg-mist rounded mt-4" />
        <div className="h-4 w-5/6 bg-mist rounded mt-2" />
        <div className="flex gap-2 mt-6">
          <div className="h-12 w-12 bg-mist rounded-full" />
          <div className="h-12 w-12 bg-mist rounded-full" />
          <div className="h-12 w-12 bg-mist rounded-full" />
        </div>
      </div>
    </div>
  );
}

