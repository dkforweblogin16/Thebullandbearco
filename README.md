# The Bull & Bear Co.

For Traders. By Traders. T-Shirts for Market Minds.

Mobile-first Next.js (App Router) storefront built with Tailwind CSS,
Zustand, and Framer Motion. All product imagery is placeholder content
from Unsplash — swap in real product photography before launch.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Zustand (cart + UI state, persisted to localStorage)
- Framer Motion (menu, cart drawer, hero transitions)
- lucide-react (icons)

## Structure

```
/app
  page.jsx                  Home
  collection/[slug]/page.jsx   Collection / category listing
  product/[id]/page.jsx        Product detail
  account/, new/, track-order/, reviews/, stores/, returns/, contact/, support/
/components
  Header, HeroCarousel, CategoryGrid, FeatureBar, ProductCard,
  TrendingProducts, SidebarMenu, BottomNav, CartDrawer, SearchOverlay,
  AnnouncementBar
/lib/data.js       Mock product + category dataset
/store/useCart.js  Cart state (Zustand, persisted)
/store/useUI.js    Menu + search overlay state
```

## Deploy from mobile (no laptop)

1. Upload this whole folder to a new GitHub repo using the GitHub mobile
   app (Add file → Upload files, or the "+" → New repository → drag in
   the zip contents).
2. Go to vercel.com (or netlify.com) on mobile, sign in with GitHub,
   and import the repo. Framework preset: **Next.js**. No extra config
   needed — it auto-detects `npm run build`.
3. Deploy. Every future push to `main` auto-redeploys.

## Local dev (if you ever get laptop access)

```bash
npm install
npm run dev
```

## Swapping in real product photos

Edit `lib/data.js` — replace the Unsplash URLs in `products`,
`collections`, and `heroSlides` with your own image URLs (or drop
files in `/public` and reference them as `/your-image.jpg`).
