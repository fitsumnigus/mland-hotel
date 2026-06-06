"use client";

// src/components/pages/AboutPageClient.tsx
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TIMELINE = [
  { year: "1923", event: "Markland House is built by the Carlow-born architect Seamus Devane for the Fitzpatrick family as a private country residence." },
  { year: "1961", event: "The Fitzpatrick family opens the house to paying guests for the first time — six rooms, no restaurant. Word spreads quietly." },
  { year: "1978", event: "The property is acquired by the current owner family. A programme of careful restoration begins, guided by the Office of Public Works." },
  { year: "1994", event: "The formal dining room opens, earning its first AA Rosette within eighteen months under chef Niall Brennan." },
  { year: "2008", event: "A new spa wing is completed, housing the thermal suite and six treatment rooms. Condé Nast Traveller lists Markland for the first time." },
  { year: "2019", event: "The Grove earns its first Michelin star under incoming head chef Sean Thornton, who joins from Restaurant Patrick Guilbaud." },
  { year: "2022", event: "The Grove is awarded a second Michelin star. Forbes Travel Guide awards the property five stars for the first time." },
  { year: "2024", event: "Markland enters its second century. The estate employs 140 people from the local community and welcomes guests from 58 countries." },
];

export function AboutPageClient() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(bodyRef, { once: true, amount: 0.1 });

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=90"
            alt="Markland Hotel estate"
            fill priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-obsidian-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/70 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="section-container pb-16 lg:pb-24">
            <motion.p className="eyebrow text-xs text-champagne-400 mb-4 tracking-[0.4em]"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              Our Story
            </motion.p>
            <motion.h1 className="font-display font-light text-ivory-50 leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}>
              Established 1923.<br /><em className="text-gradient-gold not-italic">Still Here.</em>
            </motion.h1>
            <motion.p className="font-body text-sm text-ivory-300/70 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: EASE }}>
              A century of considered hospitality in the Wicklow Hills. Independent since the beginning. Committed to the same values.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Body */}
      <div ref={bodyRef} className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="eyebrow text-xs text-champagne-500 mb-5 tracking-widest">Who We Are</p>
            <p className="font-body text-sm text-obsidian-300 leading-[1.9] mb-5">
              Markland Hotel & Spa is a privately owned country house hotel on 300 acres of managed woodland and parkland in County Wicklow — 75 kilometres south of Dublin, and a world away from it.
            </p>
            <p className="font-body text-sm text-obsidian-300 leading-[1.9] mb-5">
              We have 48 rooms and suites, a two-Michelin-starred restaurant, a second Michelin-starred brasserie, a 4,200 sq ft thermal spa, and 140 members of staff — most of whom were born within 30 kilometres of the house.
            </p>
            <p className="font-body text-sm text-obsidian-300 leading-[1.9]">
              We are not a chain. We are not managed by a brand. Every decision is made by people who are present every day and who understand that a hotel is, at its best, a form of hospitality that happens to have bedrooms.
            </p>
          </motion.div>

          <motion.div
            className="relative h-80 lg:h-auto overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <Image
              src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85"
              alt="Markland Hotel interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
            />
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mb-16"
        >
          <p className="eyebrow text-xs text-champagne-500 mb-8 tracking-widest">One Hundred Years</p>
          <div className="space-y-0 border-l border-obsidian-800 pl-8">
            {TIMELINE.map((entry, i) => (
              <motion.div
                key={entry.year}
                className="relative pb-8 last:pb-0"
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: EASE }}
              >
                <div className="absolute -left-[2.35rem] top-1 w-3 h-3 rounded-full border-2 border-champagne-600 bg-obsidian-950" />
                <p className="eyebrow text-xs text-champagne-500 mb-1.5">{entry.year}</p>
                <p className="font-body text-sm text-obsidian-400 leading-relaxed">{entry.event}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        >
          <Link href="/sustainability" className="btn-luxury-outline flex items-center gap-2 text-sm">
            Sustainability <ArrowRight size={13} />
          </Link>
          <Link href="/careers" className="btn-luxury-ghost flex items-center gap-2 text-sm">
            Join Our Team <ArrowRight size={13} />
          </Link>
          <Link href="/press" className="btn-luxury-ghost flex items-center gap-2 text-sm">
            Press <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
