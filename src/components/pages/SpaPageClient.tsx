"use client";

// src/components/pages/SpaPageClient.tsx
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Droplets, Wind, Leaf, Sparkles, Clock, ArrowRight } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TREATMENTS = [
  {
    name:     "The Markland Ritual",
    duration: "120 min",
    price:    "€220",
    desc:     "Our signature full-body journey — hot stone massage, botanical facial, and scalp treatment using native Irish botanicals.",
    tag:      "Signature",
  },
  {
    name:     "Atlantic Seaweed Bath",
    duration: "45 min",
    price:    "€120",
    desc:     "Traditional Irish seaweed drawn from the Atlantic coast, rich in minerals and antioxidants. A ceremony as old as the land.",
    tag:      "Heritage",
  },
  {
    name:     "Couples Immersion",
    duration: "90 min",
    price:    "€380",
    desc:     "A private ritual for two — thermal suite, side-by-side massage, and a glass of champagne in the relaxation suite.",
    tag:      "Couples",
  },
  {
    name:     "Deep Tissue Restore",
    duration: "60 min",
    price:    "€160",
    desc:     "Targeted therapeutic massage releasing tension in the back, neck, and shoulders. Firm pressure, precise technique.",
    tag:      "Therapeutic",
  },
  {
    name:     "Botanical Facial",
    duration: "75 min",
    price:    "€175",
    desc:     "A bespoke skin ritual designed by our resident aesthetician using seasonal Irish plant extracts and mineral-rich clay.",
    tag:      "Skin",
  },
  {
    name:     "Hammam Experience",
    duration: "60 min",
    price:    "€140",
    desc:     "Traditional steam room, black soap cleanse, and kessa exfoliation followed by a cooling herbal wrap.",
    tag:      "Ritual",
  },
];

const FACILITIES = [
  { icon: <Droplets size={20} />, name: "Thermal Pools",    desc: "Four pools at varying temperatures, from 16°C to 38°C" },
  { icon: <Wind      size={20} />, name: "Finnish Sauna",   desc: "Traditional dry sauna with Wicklow birch infusion" },
  { icon: <Leaf      size={20} />, name: "Salt Cave",       desc: "Halotherapy cave using Himalayan salt, heated to 18°C" },
  { icon: <Sparkles  size={20} />, name: "Ice Fountain",    desc: "Contrast therapy to stimulate circulation" },
];

export function SpaPageClient() {
  const heroRef   = useRef<HTMLElement>(null);
  const bodyRef   = useRef<HTMLDivElement>(null);
  const inView    = useInView(bodyRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY    = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[580px] overflow-hidden">
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
          <Image
            src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=90"
            alt="Markland Spa — thermal sanctuary"
            fill
            priority
            className="object-cover scale-110"
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-obsidian-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/60 to-transparent" />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end"
          style={{ y: textY, opacity }}
        >
          <div className="section-container pb-16 lg:pb-24">
            <motion.p
              className="eyebrow text-xs text-champagne-400 mb-4 tracking-[0.4em]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Spa & Wellness
            </motion.p>
            <motion.h1
              className="font-display font-light text-ivory-50 leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              A Ceremony of<br />
              <em className="text-gradient-gold not-italic">Restoration</em>
            </motion.h1>
            <motion.p
              className="font-body text-sm text-ivory-300/70 mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            >
              4,200 sq ft of pure sanctuary. Drawing on centuries of Irish wellness tradition, elevated through modern craft and the healing power of the Wicklow landscape.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            >
              <Link href="/contact" className="btn-luxury-primary">
                Book a Treatment
              </Link>
              <Link href="/book" className="btn-luxury-outline">
                Reserve & Add Spa
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Facilities ───────────────────────────────────────────────── */}
      <section ref={bodyRef} className="section-container section-padding">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">The Thermal Suite</p>
          <h2 className="font-display text-display-sm lg:text-display-md text-ivory-100 font-light leading-tight">
            Your Journey Begins<br />Before Your Treatment
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {FACILITIES.map((f, i) => (
            <motion.div
              key={f.name}
              className="border border-obsidian-800 p-6 hover:border-champagne-700/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
            >
              <span className="text-champagne-600 mb-4 inline-block">{f.icon}</span>
              <h3 className="font-display text-xl text-ivory-200 mb-2">{f.name}</h3>
              <p className="font-body text-xs text-obsidian-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Treatments ─────────────────────────────────────────────── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Treatments</p>
          <h2 className="font-display text-display-sm text-ivory-100 font-light mb-2">
            Signature Rituals
          </h2>
          <p className="font-body text-sm text-obsidian-400 max-w-xl">
            Each treatment is adapted to you by our therapists during a brief consultation. All products are made with Irish botanical ingredients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {TREATMENTS.map((t, i) => (
            <motion.div
              key={t.name}
              className="border border-obsidian-800 p-6 hover:border-champagne-700/30 transition-colors group"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.07, ease: EASE }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="eyebrow text-2xs border border-champagne-700/30 text-champagne-500 px-2 py-0.5">
                  {t.tag}
                </span>
                <span className="font-display text-xl text-ivory-100">{t.price}</span>
              </div>
              <h3 className="font-display text-xl text-ivory-200 mb-1 group-hover:text-ivory-100 transition-colors">{t.name}</h3>
              <div className="flex items-center gap-1.5 mb-3">
                <Clock size={11} className="text-champagne-700" />
                <span className="font-body text-xs text-obsidian-500">{t.duration}</span>
              </div>
              <p className="font-body text-xs text-obsidian-400 leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <motion.div
          className="border border-obsidian-800 p-8 lg:p-12 text-center bg-obsidian-900/30"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-3 tracking-[0.35em]">Reservations</p>
          <h2 className="font-display text-2xl lg:text-3xl text-ivory-100 font-light mb-3">
            Ready to Begin?
          </h2>
          <p className="font-body text-sm text-obsidian-400 mb-7 max-w-md mx-auto leading-relaxed">
            Spa treatments can be booked as part of a hotel stay or as a day guest. Our reservations team will curate the perfect experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-luxury-primary flex items-center gap-2">
              Enquire Now <ArrowRight size={13} />
            </Link>
            <Link href="/book" className="btn-luxury-outline">
              Book a Room + Spa
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
