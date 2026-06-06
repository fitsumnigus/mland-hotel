"use client";

// src/components/pages/DiningDetailClient.tsx
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Star, Clock, ChevronLeft, ArrowRight } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface MenuItem  { course: string; dish: string; }
interface Restaurant {
  id:             string;
  name:           string;
  tag:            string;
  cuisine:        string;
  description:    string;
  detail:         string;
  heroImage:      string;
  galleryImages:  string[];
  menuHighlights: MenuItem[];
}

interface Props { restaurant: Restaurant; }

export function DiningDetailClient({ restaurant: r }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(bodyRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const op    = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const starCount = r.tag.split("★").length - 1;

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
          <Image src={r.heroImage} alt={r.name} fill priority className="object-cover scale-110" sizes="100vw" quality={90} />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/45 to-obsidian-950/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/70 to-transparent" />

        <motion.div className="absolute inset-0 flex flex-col justify-end" style={{ y: textY, opacity: op }}>
          <div className="section-container pb-16 lg:pb-20">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-7">
              <Link href="/dining" className="inline-flex items-center gap-2 text-xs text-ivory-400/60 hover:text-ivory-200 transition-colors font-body tracking-wider group">
                <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                All Dining
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}>
              <p className="eyebrow text-xs text-champagne-400 mb-3 tracking-[0.4em]">{r.cuisine}</p>
              <h1 className="font-display font-light text-ivory-50 leading-[0.92] mb-4" style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}>
                {r.name}
              </h1>
              {starCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">{[...Array(starCount)].map((_, i) => <Star key={i} size={16} className="text-champagne-400 fill-champagne-400" />)}</div>
                  <span className="eyebrow text-2xs text-champagne-500">Michelin Guide</span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-7">
                <Clock size={12} className="text-champagne-700" />
                <span className="font-body text-sm text-ivory-300/70">{r.detail}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-luxury-primary">Reserve a Table</Link>
                <Link href="/dining" className="btn-luxury-outline">All Restaurants</Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Body */}
      <div ref={bodyRef} className="section-container py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Description */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}>
            <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-widest">About</p>
            <p className="font-body text-sm text-obsidian-300 leading-[1.9]">{r.description}</p>
          </motion.div>

          {/* Gallery */}
          {r.galleryImages.length > 1 && (
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            >
              {r.galleryImages.slice(1).map((src, i) => (
                <div key={i} className="relative h-48 overflow-hidden">
                  <Image src={src} alt={`${r.name} ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 50vw, 33vw" quality={80} />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Menu highlights */}
          <motion.div
            className="border border-obsidian-800 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <p className="eyebrow text-2xs text-champagne-600 mb-4 tracking-widest">Menu Highlights</p>
            <div className="space-y-3">
              {r.menuHighlights.map((item, i) => (
                <div key={i} className="border-b border-obsidian-800/50 pb-3 last:border-0 last:pb-0">
                  <p className="eyebrow text-2xs text-obsidian-500 mb-0.5">{item.course}</p>
                  <p className="font-body text-sm text-ivory-300">{item.dish}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reserve */}
          <motion.div
            className="border border-champagne-700/30 bg-champagne-900/10 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            <p className="eyebrow text-2xs text-champagne-600 mb-3 tracking-widest">Reservations</p>
            <p className="font-body text-xs text-obsidian-400 mb-4 leading-relaxed">
              Tables at {r.name} are reserved through our concierge team. Hotel guests receive priority booking.
            </p>
            <Link href="/contact" className="btn-luxury-primary text-xs py-2.5 w-full text-center flex items-center justify-center gap-1.5">
              Reserve a Table <ArrowRight size={12} />
            </Link>
          </motion.div>

          {/* Wine cellar link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Link href="/dining/wine" className="flex items-center justify-between border border-obsidian-800 p-4 hover:border-obsidian-600 transition-colors group">
              <span className="font-body text-sm text-ivory-400 group-hover:text-ivory-200 transition-colors">Explore the Wine Cellar</span>
              <ArrowRight size={14} className="text-champagne-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
