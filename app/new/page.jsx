import TrendingProducts from "@/components/TrendingProducts";

export const metadata = { title: "New Arrivals | The Bull & Bear Co." };

export default function NewPage() {
  return (
    <div className="pt-6">
      <h1 className="font-display font-black text-3xl text-center px-4">
        New Arrivals
      </h1>
      <p className="text-graphite text-sm text-center mt-2 px-4">
        Fresh off the press. Signal, not noise.
      </p>
      <TrendingProducts title="" subtitle="" />
    </div>
  );
}

