"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { heroSlides } from "@/lib/data";

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = heroSlides[index];

  function handleDragEnd(e, info) {
    if (info.offset.x < -60) {
      setIndex((i) => (i + 1) % heroSlides.length);
    } else if (info.offset.x > 60) {
      setIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);
    }
  }

  return (
    <div>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-ink">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slide.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" />

            <div className="absolute bottom-8 left-5 right-5 text-paper">
              <h1 className="font-display font-bold text-4xl leading-[1.05] mb-3">
                {slide.title}
              </h1>
              <p className="text-sm text-paper/85 mb-5 max-w-xs">
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className="inline-block bg-paper text-ink px-6 py-3 text-sm font-semibold tracking-wide active:scale-95 transition-transform"
              >
                {slide.cta}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 py-4 bg-paper">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-6 bg-ink" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
