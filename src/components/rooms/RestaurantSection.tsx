"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, Clock, UtensilsCrossed, Wine, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const RESTAURANTS = [
  {
    id:      "grove",
    name:    "The Grove",
    tag:     "Michelin ★★",
    desc:    "An intimate dining room celebrating modern Irish cuisine. Sean Thornton's seasonal tasting menus evolve with the estate garden — 8 courses, no shortcuts.",
    detail:  "Tuesday – Saturday · 7pm & 9:30pm",
    img:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
    bg:      "from-amber-950/60",
    cuisine: "Modern Irish · Tasting Menu",
    seats:   32,
  },
  {
    id:      "cellars",
    name:    "The Cellars",
    tag:     "Michelin ★",
    desc:    "Classic European cooking in our original 18th-century wine cellar. Rich, precise, deeply satisfying — old world technique, impeccable produce.",
    detail:  "Daily · 12pm – 2:30pm · 6pm – 10pm",
    img:     "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85",
    bg:      "from-stone-900/60",
    cuisine: "European Brasserie",
    seats:   64,
  },
  {
    id:      "terrace",
    name:    "Garden Terrace",
    tag:     "Al Fresco",
    desc:    "Summer dining on the walled terrace. Champagne brunch, afternoon tea, and light suppers under the open Irish sky.",
    detail:  "May – September · 10am – 9pm",
    img:     "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=85",
    bg:      "from-green-950/60",
    cuisine: "Garden Seasonal",
    seats:   80,
  },
];

export function RestaurantSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const r = RESTAURANTS[active];

  return (
    <section ref={sectionRef} className="relative bg-obsidian-950 overflow-hidden">
      {/* Section heading */}
      <div className="section-container pt-28 pb-0">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div>
            <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Dining</p>
            <h2 className="font-display text-display-md lg:text-display-lg text-ivory-100 font-light leading-[0.92]">
              The Art of<br />
              <em className="text-gradient-gold not-italic">Eating Well</em>
            </h2>
          </div>
          <p className="lg:max-w-xs font-body text-sm text-obsidian-400 leading-relaxed">
            Three distinct dining experiences — from the theatrical intimacy of a Michelin tasting menu to a lazy Sunday terrace brunch.
          </p>
        </motion.div>

        {/* Tab selector */}
        <div className="flex items-center gap-0 border-b border-obsidian-800">
          {RESTAURANTS.map((rest, i) => (
            <button
              key={rest.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative pb-4 pr-8 font-body text-sm transition-colors duration-200",
                i === active ? "text-ivory-100" : "text-obsidian-500 hover:text-obsidian-300"
              )}
            >
              {rest.name}
              {rest.tag.includes("Michelin") && (
                <span className="ml-2 text-2xs text-champagne-600">{rest.tag}</span>
              )}
              {i === active && (
                <motion.span
                  layoutId="rest-tab"
                  className="absolute bottom-0 left-0 right-8 h-px bg-champagne-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Full-bleed showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={r.id}
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{   opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Hero image */}
          <div className="relative h-[60vh] lg:h-[75vh] overflow-hidden">
            <motion.div className="absolute inset-0" style={{ y: bgY }}>
              <Image
                src={r.img}
                alt={r.name}
                fill
                className="object-cover scale-110"
                sizes="100vw"
                quality={90}
              />
            </motion.div>
            <div className={cn("absolute inset-0 bg-gradient-to-t", r.bg, "to-obsidian-950/10")} />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/80 via-obsidian-950/20 to-transparent" />

            {/* Michelin stars decoration */}
            {r.tag.includes("★") && (
              <motion.div
                className="absolute top-8 right-8 lg:top-12 lg:right-12 flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex gap-1">
                  {r.tag.split("★").slice(1).map((_, i) => (
                    <Star key={i} size={18} className="text-champagne-400 fill-champagne-400" />
                  ))}
                </div>
                <span className="eyebrow text-2xs text-champagne-500">Michelin Guide</span>
              </motion.div>
            )}

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="section-container pb-12 lg:pb-16">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1,  y: 0  }}
                    transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                  >
                    <p className="eyebrow text-xs text-champagne-400 mb-3">{r.cuisine}</p>
                    <h3 className="font-display text-4xl lg:text-6xl text-ivory-100 mb-5 leading-tight">{r.name}</h3>
                    <p className="font-body text-sm text-ivory-300/75 mb-8 leading-relaxed max-w-lg">{r.desc}</p>

                    <div className="flex flex-wrap items-center gap-5 mb-8">
                      <InfoPill icon={<Clock size={12} />} label={r.detail} />
                      <InfoPill icon={<UtensilsCrossed size={12} />} label={`${r.seats} covers`} />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Link href={`/dining/${r.id}`} className="btn-luxury-primary">View Menu</Link>
                      <Link href="/contact" className="btn-luxury-outline">Reserve a Table</Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom — wine & sommelier callout */}
      <div className="section-container py-16">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-8 border border-obsidian-800 p-8 lg:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          <div className="shrink-0">
            <Wine size={36} className="text-champagne-600" />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h4 className="font-display text-2xl text-ivory-200 mb-2">A Cellar of 12,000 Bottles</h4>
            <p className="font-body text-sm text-obsidian-400 leading-relaxed">
              Our master sommelier has curated one of Ireland's finest wine cellars — from grand Burgundy to rare Irish craft spirits. Private tastings and cellar tours available on request.
            </p>
          </div>
          <Link
            href="/dining/wine"
            className="shrink-0 inline-flex items-center gap-2 btn-luxury-ghost text-champagne-500 hover:text-champagne-300"
          >
            Explore cellar <ChevronRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 text-xs text-ivory-300/70 font-body">
      <span className="text-champagne-700">{icon}</span>
      {label}
    </span>
  );
}
