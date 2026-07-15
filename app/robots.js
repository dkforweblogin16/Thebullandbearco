// FILE PATH: app/robots.js
export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/checkout", "/orders", "/account"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
