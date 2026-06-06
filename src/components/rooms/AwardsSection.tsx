"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const AWARDS = [
  { name: "Forbes Travel Guide",   tier: "Five Star",          year: 2024 },
  { name: "Condé Nast Traveller",  tier: "Top 10 Ireland",     year: 2024 },
  { name: "Michelin Guide",        tier: "Two Stars",          year: 2024 },
  { name: "Tatler",                tier: "Great Spa Award",    year: 2024 },
  { name: "The Sunday Times",      tier: "Hotel of the Year",  year: 2023 },
  { name: "National Geographic",   tier: "Unique Lodges",      year: 2023 },
];

export function AwardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const textY  = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section ref={sectionRef} className="relative bg-obsidian-950 overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-champagne-700/25 to-transparent" />

      {/* Awards ribbon */}
      <div className="section-container py-16">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 tracking-[0.35em]">Recognition</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {AWARDS.map((award, i) => (
            <motion.div
              key={award.name}
              className="flex flex-col items-center text-center p-4 border border-obsidian-800/60 hover:border-champagne-700/30 transition-colors duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            >
              <Award size={18} className="text-champagne-700 group-hover:text-champagne-500 transition-colors mb-3" />
              <p className="font-body text-2xs font-medium text-ivory-400 mb-1 group-hover:text-ivory-200 transition-colors">{award.name}</p>
              <p className="eyebrow text-2xs text-champagne-600/70">{award.tier}</p>
              <p className="text-2xs text-obsidian-600 mt-1">{award.year}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-bleed CTA banner */}
      <div className="relative overflow-hidden" style={{ minHeight: "480px" }}>
        {/* Background */}
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=85"
            alt="Markland Hotel estate aerial view"
            fill
            className="object-cover scale-110"
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/98 via-obsidian-950/70 to-obsidian-950/40" />

        {/* Decorative frame */}
        <div className="absolute inset-8 lg:inset-16 border border-champagne-700/15 pointer-events-none" />
        <div className="absolute inset-12 lg:inset-20 border border-champagne-700/08 pointer-events-none hidden lg:block" />

        {/* Corner ornaments */}
        {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`}>
            <div className={cn(
              "absolute w-5 h-px bg-champagne-600/40",
              i % 2 === 0 ? "left-0" : "right-0"
            )} />
            <div className={cn(
              "absolute h-5 w-px bg-champagne-600/40",
              i < 2 ? "top-0" : "bottom-0",
              i % 2 === 0 ? "left-0" : "right-0"
            )} />
          </div>
        ))}

        {/* Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center py-24 px-6"
          style={{ y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="eyebrow text-xs text-champagne-500 mb-6 tracking-[0.4em]">Begin Your Stay</p>
            <h2 className="font-display text-display-sm lg:text-display-lg text-ivory-100 font-light leading-[0.92] mb-6 max-w-3xl mx-auto">
              Your most <em className="text-gradient-gold not-italic">memorable</em><br />
              night begins here
            </h2>
            <span className="gold-line mx-auto mb-8" />
            <p className="font-body text-sm text-ivory-300/60 max-w-md mx-auto mb-10 leading-relaxed">
              Best rate guaranteed when you book direct. Complimentary welcome amenities, room upgrades subject to availability, and our undivided attention from the moment you arrive.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/book" className="btn-luxury-primary px-10 py-4 text-sm">
                Reserve Your Room
              </Link>
              <Link href="/contact" className="btn-luxury-outline px-8 py-4 text-sm flex items-center gap-2">
                Speak to Concierge <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


