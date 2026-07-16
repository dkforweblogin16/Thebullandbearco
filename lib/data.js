// Dummy catalog data — all imagery sourced from Unsplash (royalty-free placeholders).

export const categories = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
  { slug: "travel", label: "Travel" },
  { slug: "polos", label: "Polos" },
  { slug: "shirts", label: "Shirts" },
  { slug: "tees", label: "Tees" },
  { slug: "co-ords", label: "Co-ords" },
  { slug: "joggers", label: "Joggers" },
  { slug: "shorts", label: "Shorts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "jackets", label: "Jackets" },
];

export const collections = [
  {
    slug: "travel",
    label: "Travel Essentials",
    image:
      "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "polos",
    label: "Polos",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "shirts",
    label: "Shirts",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "tees",
    label: "Oversized Tees",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "co-ords",
    label: "Co-ords",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "shorts",
    label: "Shorts",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "joggers",
    label: "Joggers",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
  },
];

export const heroSlides = [
  {
    id: 1,
    eyebrow: "New Drop",
    title: "The Bull Run Tee",
    subtitle: "Built for the ones who buy the dip and hold the line.",
    cta: "Shop Now",
    href: "/collection/tees",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    eyebrow: "Trader Collection",
    title: "Trade The Trend",
    subtitle: "Minimal streetwear for market minds. No noise, just signal.",
    cta: "Explore Collection",
    href: "/collection/co-ords",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    eyebrow: "Travel Capsule",
    title: "Desk To Departure",
    subtitle: "From the trading desk to the boarding gate, effortlessly sharp.",
    cta: "Shop Travel",
    href: "/collection/travel",
    image:
      "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=80",
  },
];

export const products = [
  {
    id: 1,
    name: "Bull Run Oversized Tee",
    price: 799,
    originalPrice: 1499,
    discount: "47% OFF",
    rating: 4.7,
    reviews: 312,
    category: "tees",
    tags: ["Oversized", "Pure Cotton"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A relaxed, oversized fit tee in heavyweight cotton — the everyday layer for market watchers and street walkers alike.",
  },
  {
    id: 2,
    name: "Green Candle Graphic Tee",
    price: 849,
    originalPrice: 1599,
    discount: "47% OFF",
    rating: 4.8,
    reviews: 205,
    category: "tees",
    tags: ["Regular Fit", "Pure Cotton"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Every green candle tells a story. A bold graphic tee for the days the chart goes your way.",
  },
  {
    id: 3,
    name: "Classic Polo — Navy",
    price: 1099,
    originalPrice: 1999,
    discount: "45% OFF",
    rating: 4.6,
    reviews: 154,
    category: "polos",
    tags: ["Regular Fit", "Breathable"],
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    ],
    // Each entry = one color option. "swatch" is the small thumbnail shown in
    // the Select Color row; "images" (optional) swaps the main photo gallery
    // when that color is picked. If a color has no "images", the swatch is
    // shown but the main photo stays the same.
    colors: [
      {
        name: "Navy",
        swatch:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80",
        images: [
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        name: "Olive",
        swatch:
          "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=200&q=80",
        images: [
          "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        name: "Blush Pink",
        swatch:
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=200&q=80",
        images: [
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Boardroom to bell close — a sharp, breathable polo that holds its shape through the trading day.",
  },
  {
    id: 4,
    name: "Travel Tech Polo — Olive",
    price: 1299,
    originalPrice: 2299,
    discount: "43% OFF",
    rating: 4.8,
    reviews: 89,
    category: "travel",
    tags: ["Quick Dry", "Wrinkle Resistant"],
    images: [
      "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=800&q=80",
    ],
    colors: [
      {
        name: "Olive",
        swatch:
          "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=200&q=80",
        images: [
          "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        name: "Sky Blue",
        swatch:
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=200&q=80",
        images: [
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "From city showers to mountain trails — stay sharp on every leg of the journey.",
  },
  {
    id: 5,
    name: "Oversized Moses Co-ord Set",
    price: 1599,
    originalPrice: 2999,
    discount: "1,400 OFF",
    rating: 4.8,
    reviews: 5,
    category: "co-ords",
    tags: ["Popcorn Texture", "Relaxed Fit"],
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A textured co-ord set for airport lounges and evening trades. Effortless, matching, sharp.",
  },
  {
    id: 6,
    name: "Classic Polo T-Shirt Pack of 2",
    price: 1499,
    originalPrice: 2999,
    discount: "1,500 OFF",
    rating: 5.0,
    reviews: 1,
    category: "polos",
    tags: ["High IQ Lasting Color"],
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Two polos, zero compromise. Lasting color technology keeps you sharp, wash after wash.",
  },
  {
    id: 7,
    name: "Bear Market Oversized Tee",
    price: 799,
    originalPrice: 1499,
    discount: "47% OFF",
    rating: 4.5,
    reviews: 98,
    category: "tees",
    tags: ["Oversized", "Cotton"],
    images: [
      "https://images.unsplash.com/photo-1622445275649-2ffc42e9a6c5?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Red days build character. A graphic tee for the ones who don't panic sell.",
  },
  {
    id: 8,
    name: "Cargo Joggers — Sage",
    price: 1199,
    originalPrice: 2199,
    discount: "45% OFF",
    rating: 4.6,
    reviews: 61,
    category: "joggers",
    tags: ["Tapered Fit", "Cotton Blend"],
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Tapered cargo joggers built for pacing the room during a volatile session.",
  },
  {
    id: 9,
    name: "Sweat Shorts — Charcoal",
    price: 699,
    originalPrice: 1299,
    discount: "46% OFF",
    rating: 4.4,
    reviews: 43,
    category: "shorts",
    tags: ["Relaxed Fit", "Cotton"],
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Off-desk comfort. Soft, breathable shorts for the hours the market's closed.",
  },
  {
    id: 10,
    name: "Authentic Classic Fit T-Shirt",
    price: 599,
    originalPrice: 799,
    discount: "200 OFF",
    rating: 4.8,
    reviews: 276,
    category: "tees",
    tags: ["Regular Fit", "Pure Cotton"],
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Be fearlessly authentic. A wardrobe staple, cut for everyday regular fit comfort.",
  },
  {
    id: 11,
    name: "Linen Shirt — Maroon",
    price: 1399,
    originalPrice: 2499,
    discount: "44% OFF",
    rating: 4.5,
    reviews: 37,
    category: "shirts",
    tags: ["Linen Blend", "Full Sleeve"],
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A breathable linen shirt for post-market dinners and long weekend calls.",
  },
  {
    id: 12,
    name: "Wings of Freedom Oversized Tee",
    price: 849,
    originalPrice: 1599,
    discount: "47% OFF",
    rating: 4.7,
    reviews: 122,
    category: "tees",
    tags: ["Oversized", "Back Print"],
    images: [
      "https://images.unsplash.com/photo-1618453292459-53bfb99e0b7f?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Bold back-print graphic tee — for the ones who trade their own way.",
  },
];

export const posters = [
  {
    id: 1,
    title: "Oversized Fit",
    subtitle: "Cut loose. Built for the desk and the street.",
    href: "/collection/tees",
    image:
      "https://images.unsplash.com/photo-1622445275649-2ffc42e9a6c5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Travel Ready",
    subtitle: "Water repellent, UPF 50+, and built for movement.",
    href: "/collection/travel",
    image:
      "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Built For The Desk",
    subtitle: "Shape retention. Anti-odour. Zero compromise.",
    href: "/collection/polos",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
  },
];

// ---------------------------------------------------------------------
// SITE-WIDE COUPON / OFFER SETTINGS
// Edit these values to change the coupon shown on every product page.
// No code knowledge needed — just change the text/numbers between the quotes.
// ---------------------------------------------------------------------
export const activeOffer = {
  code: "B3G15",                          // Coupon code shown to the customer
  bulkDiscountPercent: 15,                // "as low as" price = product price minus this %
  bulkLabel: "Buy any 3 & Get flat 15% OFF", // Bold offer line
  subLabel: "Offer Ending Soon. Hurry!",     // Small line under the bold offer
  termsHref: "/terms",                       // Where "Offer T&C" links to
  saleDurationHours: 9,                      // Countdown length shown under the coupon
};

export function getProductById(id) {
  return products.find((p) => String(p.id) === String(id));
}

export function getProductsByCategory(slug) {
  if (!slug || slug === "all") return products;
  return products.filter((p) => p.category === slug);
}
