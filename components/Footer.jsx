// FILE PATH: components/Footer.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, MessageCircle, ChevronDown, ChevronRight } from "lucide-react";
import { categories } from "@/lib/data";

const accordions = [
  {
    title: "Categories",
    links: categories.map((c) => ({ label: c.label, href: `/collection/${c.slug}` })),
  },
  {
    title: "Need Help",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Support", href: "/support" },
      { label: "Return & Exchange", href: "/returns" },
      { label: "Contact Us", href: "/contact" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(null);

  // Don't show the footer on focused-flow pages — login, checkout, admin.
  const hideOnRoutes = ["/account", "/checkout", "/admin"];
  const hide = hideOnRoutes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
  if (hide) return null;

  return (
    <footer className="bg-ink text-paper px-5 pt-10 pb-8 mt-6">
      <p className="font-display font-bold text-xl mb-4">
        Shop Bull &amp; Bear Co. on the go
      </p>
      <button className="w-full bg-paper text-ink rounded-lg py-3.5 font-semibold tracking-wide mb-10 active:scale-[0.98] transition-transform">
        Download App
      </button>

      <p className="font-semibold text-lg mb-3">Get in touch</p>
      <div className="flex gap-3 mb-10">
        <a
          href="#"
          aria-label="Instagram"
          className="w-11 h-11 rounded-full bg-paper text-ink flex items-center justify-center"
        >
          <Instagram size={18} />
        </a>
        <a
          href="#"
          aria-label="Facebook"
          className="w-11 h-11 rounded-full bg-paper text-ink flex items-center justify-center"
        >
          <Facebook size={18} />
        </a>
        <a
          href="https://wa.me/910000000000"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-11 h-11 rounded-full bg-paper text-ink flex items-center justify-center"
        >
          <MessageCircle size={18} />
        </a>
      </div>

      {accordions.map((section) => {
        const isOpen = open === section.title;
        return (
          <div key={section.title} className="border-b border-paper/20">
            <button
              onClick={() => setOpen(isOpen ? null : section.title)}
              className="w-full flex items-center justify-between py-4 font-semibold text-lg"
            >
              {section.title}
              <ChevronDown
                size={18}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="pb-4 flex flex-col gap-3 text-paper/75 text-sm">
                {section.links.map((l) => (
                  <Link key={l.label} href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Link
        href="/stores"
        className="w-full flex items-center justify-between py-4 font-semibold text-lg border-b border-paper/20"
      >
        Stores Near Me
        <ChevronRight size={18} />
      </Link>

      <p className="text-paper/50 text-xs mt-6 leading-relaxed">
        © {new Date().getFullYear()} The Bull &amp; Bear Co. All rights reserved.
      </p>
    </footer>
  );
}

