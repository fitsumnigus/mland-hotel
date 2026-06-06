"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Sparkles, Droplets, Wind, Leaf } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TREATMENTS = [
  { icon: <Droplets size={16} />, name: "Hydrotherapy",    desc: "Thermal pools & contrast bathing drawn from natural springs" },
  { icon: <Leaf     size={16} />, name: "Botanical Ritual", desc: "Native Irish botanical oils, hand-harvested seasonally" },
  { icon: <Wind     size={16} />, name: "Heat & Ice",        desc: "Finnish sauna, ice fountain, and heated salt cave" },
  { icon: <Sparkles size={16} />, name: "Signature Facial",  desc: "Bespoke skin ritual designed by our resident aesthetician" },
];

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85",
  "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=800&q=85",
];

export function SpaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  });

  // All transforms defined at top-level — never inside JSX
  const imgY    = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgInnerY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  const itemVariants = {
    hidden:  { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: 0.1 * i, duration: 0.65, ease: EASE },
    }),
  };

  return (
    <section ref={sectionRef} className="relative bg-obsidian-950 overflow-hidden">
      {/* Ambient background orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(184,196,160,0.04) 0%, transparent 70%)" }}
      />

      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: imagery cluster ──────────────────────────────── */}
          <motion.div className="relative order-2 lg:order-1" style={{ y: imgY }}>
            {/* Main image */}
            <div className="relative h-[480px] lg:h-[620px] overflow-hidden rounded-sm">
              <motion.div className="absolute inset-0" style={{ scale: 1.08, y: imgInnerY }}>
                <Image
                  src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=85"
                  alt="Markland Spa — thermal pools"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian-950/60" />
            </div>

            {/* Floating secondary image */}
            <motion.div
              className="absolute -right-6 lg:-right-10 top-16 w-44 lg:w-56 h-56 lg:h-72 overflow-hidden rounded-sm border-2 border-obsidian-900 shadow-luxury-lg"
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            >
              <Image
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80"
                alt="Spa treatment room"
                fill
                className="object-cover"
                sizes="224px"
              />
            </motion.div>

            {/* Floating stat card */}
            <motion.div
              className="absolute -left-4 lg:-left-8 bottom-10 card-luxury px-5 py-4 max-w-[200px]"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            >
              <p className="font-display text-3xl text-ivory-100 leading-none mb-1">4,200</p>
              <p className="eyebrow text-2xs text-champagne-500 tracking-widest">sq ft of wellness</p>
              <div className="mt-2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-champagne-500/60" />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: copy ───────────────────────────────────────── */}
          <motion.div className="order-1 lg:order-2" style={{ y: textY }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Spa & Wellness</p>
              <h2 className="font-display text-display-sm lg:text-display-md text-ivory-100 font-light leading-[0.95] mb-6">
                A Ceremony<br />
                of <em className="text-gradient-gold not-italic">Restoration</em>
              </h2>
              <span className="gold-line mb-8" />
              <p className="font-body text-sm text-obsidian-400 leading-relaxed mb-4">
                Our 4,200 sq ft spa sanctuary draws on centuries of Irish wellness tradition — turf baths, seaweed rituals, and the healing power of Atlantic waters — elevated through modern craft.
              </p>
              <p className="font-body text-sm text-obsidian-400 leading-relaxed mb-10">
                The journey begins before your appointment. Step into our thermal suite, move between pools of varying temperature, and let time dissolve.
              </p>
            </motion.div>

            {/* Treatments grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {TREATMENTS.map((t, i) => (
                <motion.div
                  key={t.name}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="border border-obsidian-800 p-4 hover:border-champagne-700/40 transition-colors duration-300 group"
                >
                  <span className="inline-flex text-champagne-600 group-hover:text-champagne-400 transition-colors mb-3">
                    {t.icon}
                  </span>
                  <h4 className="font-body text-sm font-medium text-ivory-300 mb-1">{t.name}</h4>
                  <p className="text-2xs text-obsidian-500 leading-relaxed">{t.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            >
              <Link href="/spa" className="btn-luxury-primary">Explore Spa</Link>
              <Link href="/spa/book" className="btn-luxury-outline">Book a Treatment</Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom photo strip */}
      <div className="border-t border-obsidian-800/60">
        <div className="grid grid-cols-3">
          {GALLERY_IMGS.map((src, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden"
              style={{ height: "160px" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 * i }}
            >
              <Image
                src={src}
                alt={`Spa gallery ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-obsidian-950/20 hover:bg-transparent transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
