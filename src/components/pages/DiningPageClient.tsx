"use client";

// src/components/pages/DiningPageClient.tsx
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Star, Clock, UtensilsCrossed, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const RESTAURANTS = [
  {
    id:      "grove",
    name:    "The Grove",
    tag:     "Michelin ★★",
    cuisine: "Modern Irish Tasting Menu",
    desc:    "An intimate 32-cover dining room celebrating modern Irish cuisine. Chef Sean Thornton's seasonal tasting menus evolve with the estate garden — eight courses, no shortcuts, no compromises.",
    hours:   "Tuesday – Saturday · 7pm & 9:30pm",
    img:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
    stars:   2,
  },
  {
    id:      "cellars",
    name:    "The Cellars",
    tag:     "Michelin ★",
    cuisine: "European Brasserie",
    desc:    "Classic European cooking in our original 18th-century wine cellar. Rich, precise, deeply satisfying — old world technique, impeccable Irish produce, and a cellar of 12,000 bottles.",
    hours:   "Daily · 12pm – 2:30pm · 6pm – 10pm",
    img:     "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85",
    stars:   1,
  },
  {
    id:      "terrace",
    name:    "Garden Terrace",
    tag:     "Al Fresco",
    cuisine: "Garden Seasonal",
    desc:    "Summer dining on the walled terrace. Champagne brunch, afternoon tea, and light suppers under the open Irish sky. May through September.",
    hours:   "May – September · 10am – 9pm",
    img:     "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=85",
    stars:   0,
  },
];

export function DiningPageClient() {
  const heroRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(bodyRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const op    = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90"
            alt="Markland dining — The Grove"
            fill priority
            className="object-cover scale-110"
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-obsidian-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/70 to-transparent" />

        <motion.div className="absolute inset-0 flex flex-col justify-end" style={{ y: textY, opacity: op }}>
          <div className="section-container pb-16 lg:pb-24">
            <motion.p className="eyebrow text-xs text-champagne-400 mb-4 tracking-[0.4em]"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              Dining
            </motion.p>
            <motion.h1 className="font-display font-light text-ivory-50 leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}>
              The Art of<br /><em className="text-gradient-gold not-italic">Eating Well</em>
            </motion.h1>
            <motion.p className="font-body text-sm text-ivory-300/70 mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: EASE }}>
              Three distinct dining experiences — from the theatrical intimacy of a Michelin tasting menu to a lazy Sunday terrace brunch.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Restaurants */}
      <div ref={bodyRef} className="section-container section-padding space-y-6">
        {RESTAURANTS.map((r, i) => (
          <motion.div
            key={r.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-obsidian-800 overflow-hidden"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: i * 0.12, ease: EASE }}
          >
            {/* Image */}
            <div className={cn("relative h-64 lg:h-auto", i % 2 === 1 && "lg:order-2")}>
              <Image src={r.img} alt={r.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" quality={85} />
              <div className="absolute inset-0 bg-obsidian-950/20" />
              {r.stars > 0 && (
                <div className="absolute top-4 right-4 flex gap-1">
                  {[...Array(r.stars)].map((_, si) => (
                    <Star key={si} size={16} className="text-champagne-400 fill-champagne-400" />
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className={cn("p-8 lg:p-10 flex flex-col justify-center", i % 2 === 1 && "lg:order-1")}>
              <span className="eyebrow text-2xs text-champagne-600 mb-2 tracking-widest">{r.tag}</span>
              <h2 className="font-display text-3xl lg:text-4xl text-ivory-100 font-light mb-2">{r.name}</h2>
              <p className="eyebrow text-2xs text-obsidian-500 mb-4">{r.cuisine}</p>
              <p className="font-body text-sm text-obsidian-300 leading-relaxed mb-4">{r.desc}</p>
              <div className="flex items-center gap-2 mb-6">
                <Clock size={12} className="text-champagne-700" />
                <span className="font-body text-xs text-obsidian-500">{r.hours}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/dining/${r.id}`} className="btn-luxury-primary text-xs py-2.5 px-5 flex items-center gap-1.5">
                  View Menu <ArrowRight size={12} />
                </Link>
                <Link href="/contact" className="btn-luxury-outline text-xs py-2.5 px-5">
                  Reserve a Table
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Wine cellar CTA */}
        <motion.div
          className="border border-obsidian-800 p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        >
          <div className="flex-1">
            <p className="eyebrow text-xs text-champagne-500 mb-2 tracking-widest">The Cellar</p>
            <h3 className="font-display text-2xl text-ivory-100 font-light mb-2">12,000 Bottles. One Sommelier.</h3>
            <p className="font-body text-sm text-obsidian-400 leading-relaxed">
              Our master sommelier has curated one of Ireland's finest wine cellars. Private tastings and cellar tours available on request.
            </p>
          </div>
          <Link href="/dining/wine" className="btn-luxury-outline flex items-center gap-2 shrink-0 text-sm">
            Explore Cellar <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
