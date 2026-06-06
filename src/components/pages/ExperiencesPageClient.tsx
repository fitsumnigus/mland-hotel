"use client";

// src/components/pages/ExperiencesPageClient.tsx
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const EXPERIENCES = [
  {
    name:  "Private Estate Tour",
    tag:   "Heritage",
    desc:  "A guided walk through 300 acres of managed woodland, walled gardens, and the restored Victorian glasshouse with our head groundskeeper.",
    img:   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
    duration: "2 hours",
  },
  {
    name:  "Whiskey & Cheese Tasting",
    tag:   "Culinary",
    desc:  "An evening in the old library with our sommelier — six Irish whiskeys paired with artisan cheeses from the island.",
    img:   "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=85",
    duration: "90 minutes",
  },
  {
    name:  "Guided Wild Swimming",
    tag:   "Adventure",
    desc:  "A sunrise cold-water dip in a private mountain lake, guided by a qualified open-water swimming instructor. Towels and hot drinks provided.",
    img:   "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=85",
    duration: "90 minutes",
  },
  {
    name:  "Falconry",
    tag:   "Heritage",
    desc:  "A private session with our master falconer and a Harris hawk on the estate grounds. No experience necessary.",
    img:   "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=85",
    duration: "60 minutes",
  },
  {
    name:  "Cookery Masterclass",
    tag:   "Culinary",
    desc:  "A half-day in the kitchen with Chef Sean Thornton. Learn the techniques behind our Michelin-starred tasting menu.",
    img:   "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85",
    duration: "Half day",
  },
  {
    name:  "Star Gazing Evening",
    tag:   "Exclusive",
    desc:  "The Wicklow dark sky reserve is among Europe's finest. A private astronomer leads a guided evening from the estate hilltop.",
    img:   "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=85",
    duration: "2 hours",
  },
];

export function ExperiencesPageClient() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(bodyRef, { once: true, amount: 0.1 });

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90"
            alt="Markland Estate — experiences"
            fill priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-obsidian-950/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/70 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="section-container pb-16 lg:pb-24">
            <motion.p className="eyebrow text-xs text-champagne-400 mb-4 tracking-[0.4em]"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              Experiences
            </motion.p>
            <motion.h1 className="font-display font-light text-ivory-50 leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}>
              Beyond the<br /><em className="text-gradient-gold not-italic">Ordinary</em>
            </motion.h1>
            <motion.p className="font-body text-sm text-ivory-300/70 mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: EASE }}>
              Curated encounters with the landscape, culture, and craft of County Wicklow. Each experience is available exclusively to Markland guests.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: EASE }}>
              <Link href="/contact" className="btn-luxury-primary">
                Book an Experience
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div ref={bodyRef} className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.name}
              className="border border-obsidian-800 overflow-hidden group hover:border-champagne-700/30 transition-colors duration-300"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={exp.img}
                  alt={exp.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 to-transparent" />
                <span className="absolute bottom-3 left-4 eyebrow text-2xs text-champagne-400 border border-champagne-700/30 bg-obsidian-900/60 px-2 py-0.5">
                  {exp.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-ivory-100 mb-1 group-hover:text-champagne-200 transition-colors">{exp.name}</h3>
                <p className="eyebrow text-2xs text-obsidian-500 mb-3">{exp.duration}</p>
                <p className="font-body text-xs text-obsidian-400 leading-relaxed mb-4">{exp.desc}</p>
                <Link href="/contact" className="inline-flex items-center gap-1.5 eyebrow text-2xs text-champagne-500 hover:text-champagne-300 transition-colors">
                  Enquire <ArrowRight size={11} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 border border-obsidian-800 p-8 lg:p-12 text-center bg-obsidian-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-3 tracking-widest">Bespoke Arrangements</p>
          <h2 className="font-display text-2xl lg:text-3xl text-ivory-100 font-light mb-3">
            Something Not Listed?
          </h2>
          <p className="font-body text-sm text-obsidian-400 max-w-md mx-auto mb-7 leading-relaxed">
            Our concierge team can arrange virtually any experience in Ireland — private access, exclusive venues, or something entirely original.
          </p>
          <Link href="/contact" className="btn-luxury-primary flex items-center gap-2 mx-auto w-fit">
            Speak to Concierge <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
