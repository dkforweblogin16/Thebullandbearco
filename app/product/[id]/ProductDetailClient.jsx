// FILE PATH: app/product/[id]/ProductDetailClient.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingBag, Heart, Zap } from "lucide-react";
import { fetchProductById, fetchAllProducts } from "@/lib/products";
import { fetchReviews, submitReview } from "@/lib/reviews";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { useAuth } from "@/components/AuthProvider";
import ProductCard from "@/components/ProductCard";
import ProductFeed from "@/components/ProductFeed";
import OfferCard from "@/components/OfferCard";
import SaleCountdown from "@/components/SaleCountdown";
import SizeGuideModal from "@/components/SizeGuideModal";
import DeliveryCheck from "@/components/DeliveryCheck";
import ProductAccordions from "@/components/ProductAccordions";
import ColorSwatches from "@/components/ColorSwatches";

export default function ProductDetailClient({ id, initialProduct = null }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const { has, toggle } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(initialProduct);
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!initialProduct);

  const [activeImg, setActiveImg] = useState(0);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");

  // The product itself already comes from the server (initialProduct), so
  // this only needs to hit the network as a fallback for the rare case the
  // server couldn't resolve it. This keeps the main image/price/buttons
  // from being gated behind a client round trip on every navigation.
  useEffect(() => {
    let active = true;
    setProduct(initialProduct);
    setActiveImg(0);
    setActiveColorIndex(0);

    if (initialProduct) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchProductById(id).then((p) => {
      if (!active) return;
      setProduct(p);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, initialProduct]);

  // Recommendations ("You May Also Like" / "Our Bestsellers") and reviews
  // are fetched separately, in the background, so a slow catalog/reviews
  // fetch never blocks the core product from showing.
  useEffect(() => {
    let active = true;
    setAllProducts([]);
    setReviews([]);
    Promise.all([fetchAllProducts(), fetchReviews(id)]).then(([all, revs]) => {
      if (!active) return;
      setAllProducts(all);
      setReviews(revs);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const feed = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.id !== product.id);
  }, [allProducts, product]);

  if (loading) {
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

  if (!product) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-display text-xl text-ink">Item not found.</p>
      </div>
    );
  }

  const wishlisted = has(product.id);
  const displayImages =
    product.colors?.length && product.colors[activeColorIndex]?.images?.length
      ? product.colors[activeColorIndex].images
      : product.images;
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;
  const reviewCount = reviews.length || product.reviews;

  function handleAddToCart() {
    addItem(product, size || product.sizes[1] || product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product, size || product.sizes[1] || product.sizes[0]);
    setSizeGuideOpen(false);
    router.push("/checkout");
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setReviewMsg("");
    try {
      await submitReview({
        productId: product.id,
        userId: user?.id,
        reviewerName: reviewForm.name || "Anonymous",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewMsg("Thanks — your review has been posted!");
      setReviewForm({ name: "", rating: 5, comment: "" });
      fetchReviews(product.id).then(setReviews);
    } catch (err) {
      setReviewMsg(err.message);
    }
  }

  return (
    <div className="pb-24">
      <div className="relative w-full aspect-[4/5] bg-mist">
        <Image
          src={displayImages[activeImg]}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        <button
          onClick={() => toggle(product.id, user?.id)}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 bg-paper/90 backdrop-blur rounded-full p-2"
        >
          <Heart size={18} className={wishlisted ? "fill-red text-red" : "text-ink"} />
        </button>
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-1 rounded-full transition-all ${
                  i === activeImg ? "w-6 bg-paper" : "w-1.5 bg-paper/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-1.5">
          <Star size={15} className="fill-gold text-gold" />
          <span className="text-sm font-bold text-ink">{avgRating}</span>
          <span className="text-sm text-graphite">({reviewCount} reviews)</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold border border-line rounded-md px-3 py-1 text-graphite"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-display font-bold text-2xl leading-tight text-ink">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-2 mt-3 tabular">
          <span className="font-bold text-2xl text-ink">₹{product.price}</span>
          <span className="text-graphite line-through text-base">
            ₹{product.originalPrice}
          </span>
          <span className="text-green text-sm font-bold">
            {product.discount}
          </span>
        </div>
        <p className="text-sm text-violet font-medium mt-1">
          Lowest price in last 30 days
        </p>

        <OfferCard product={product} />
        <SaleCountdown />

        <p className="text-sm text-graphite leading-relaxed mt-4">
          {product.description}
        </p>

        <ColorSwatches
          colors={product.colors}
          activeIndex={activeColorIndex}
          onSelect={(i) => {
            setActiveColorIndex(i);
            setActiveImg(0);
          }}
        />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-ink">Select Size</p>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs font-semibold text-ink underline"
            >
              Size Guide
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-12 h-12 rounded-full border text-sm font-semibold transition-colors ${
                  size === s
                    ? "bg-ink text-paper border-ink"
                    : "border-line text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <DeliveryCheck />

        <ProductAccordions
          description={product.description}
          rating={avgRating}
          reviewCount={reviewCount}
        />
      </div>

      {/* Reviews */}
      <div id="reviews" className="mt-10 px-4 scroll-mt-20">
        <h2 className="font-display font-bold text-xl text-ink mb-4">
          Reviews ({reviewCount})
        </h2>

        {reviews.length > 0 && (
          <div className="space-y-4 mb-6">
            {reviews.slice(0, 5).map((r) => (
              <div key={r.id} className="border-b border-line pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-ink">{r.reviewer_name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-graphite leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="border border-line rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-ink">Write a review</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setReviewForm({ ...reviewForm, rating: n })}
              >
                <Star
                  size={22}
                  className={n <= reviewForm.rating ? "fill-gold text-gold" : "text-line"}
                />
              </button>
            ))}
          </div>
          <input
            placeholder="Your name"
            value={reviewForm.name}
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <textarea
            placeholder="Share your experience..."
            rows={3}
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <button className="w-full bg-ink text-paper py-3 rounded-lg text-sm font-semibold">
            Submit Review
          </button>
          {reviewMsg && <p className="text-xs text-graphite">{reviewMsg}</p>}
        </form>
      </div>

      {related.length > 0 && (
        <div className="mt-10 mb-6">
          <h2 className="font-display font-bold text-xl px-4 mb-4 text-ink">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-line pt-8">
        <h2 className="font-display font-bold text-xl px-4 mb-4 text-ink">
          Our Bestsellers
        </h2>
        <ProductFeed products={feed} />
      </div>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        availableSizes={product.sizes}
        selectedSize={size}
        onSelectSize={setSize}
        onAddToCart={() => {
          handleAddToCart();
          setSizeGuideOpen(false);
        }}
        onBuyNow={handleBuyNow}
      />

      <div
  className="fixed bottom-0 left-0 right-0 z-30 bg-paper border-t border-line flex gap-3 px-4 pt-3"
  style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
>
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 border py-3.5 rounded-lg font-semibold text-sm tracking-wide active:scale-[0.98] transition-transform ${
            added ? "border-green text-green" : "border-ink text-ink"
          }`}
        >
          {added ? "Added ✓" : "Add to Cart"}
          {!added && <ShoppingBag size={15} />}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-1.5 bg-ink text-paper py-3.5 rounded-lg font-semibold text-sm tracking-wide active:scale-[0.98] transition-transform"
        >
          Buy Now
          <Zap size={15} className="fill-gold text-gold" />
        </button>
      </div>
    </div>
  );
}

