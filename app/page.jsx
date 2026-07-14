import HeroCarousel from "@/components/HeroCarousel";
import FeatureBar from "@/components/FeatureBar";
import CategoryGrid from "@/components/CategoryGrid";
import TrendingProducts from "@/components/TrendingProducts";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FeatureBar />
      <CategoryGrid />

      <TrendingProducts
        title="Trending Products"
        subtitle="What the desk is buying this week"
        offset={0}
      />

      <section className="px-4 py-10 bg-ink text-paper">
        <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2 text-center">
          Trader Collection
        </p>
        <h2 className="font-display font-bold text-3xl text-center leading-tight mb-3">
          For Traders.
          <br />
          By Traders.
        </h2>
        <p className="text-paper/70 text-sm text-center max-w-xs mx-auto mb-6">
          T-Shirts for Market Minds. Minimal streetwear, worn by the ones who
          read the charts before the news.
        </p>
        <Link
          href="/collection/co-ords"
          className="block w-fit mx-auto bg-paper text-ink px-6 py-3 text-sm font-bold tracking-wide active:scale-95 transition-transform"
        >
          Shop The Collection
        </Link>
      </section>

      <TrendingProducts
        title="Bull & Bear Favourite"
        subtitle="Handpicked bestsellers, restocked weekly"
        offset={4}
      />
    </>
  );
}
