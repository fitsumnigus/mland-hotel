"use client";

// src/components/pages/EventsPageClient.tsx
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Heart, Mic2, Crown, Building2, Users, ArrowRight } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const EVENT_TYPES = [
  {
    icon:     Heart,
    title:    "Weddings",
    desc:     "Ceremony and reception in our walled gardens or candlelit ballroom. Our events team orchestrates every detail from first enquiry to last dance.",
    capacity: "Up to 220 guests",
    href:     "/contact",
  },
  {
    icon:     Mic2,
    title:    "Conferences",
    desc:     "Six flexible spaces with state-of-the-art AV, high-speed connectivity, and a dedicated event coordinator on-site throughout.",
    capacity: "Up to 180 delegates",
    href:     "/contact",
  },
  {
    icon:     Crown,
    title:    "Private Dining",
    desc:     "Exclusive use of The Grove or The Cellars — ideal for board dinners, milestone celebrations, and product launches.",
    capacity: "Up to 80 guests",
    href:     "/contact",
  },
  {
    icon:     Building2,
    title:    "Retreats",
    desc:     "Multi-day corporate retreats with dedicated spa access, curated team activities, and bespoke catering throughout.",
    capacity: "10 – 60 guests",
    href:     "/contact",
  },
];

const STATS = [
  { value: "6",   label: "Event Spaces" },
  { value: "220", label: "Max Capacity" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

export function EventsPageClient() {
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
      <section ref={heroRef} className="relative h-[75vh] min-h-[520px] overflow-hidden">
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=90"
            alt="Markland Hotel grand ballroom events"
            fill priority
            className="object-cover scale-110"
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-obsidian-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/70 to-transparent" />

        <motion.div className="absolute inset-0 flex flex-col justify-end" style={{ y: textY, opacity: op }}>
          <div className="section-container pb-16 lg:pb-24">
            <motion.p className="eyebrow text-xs text-champagne-400 mb-4 tracking-[0.4em]"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              Meetings & Events
            </motion.p>
            <motion.h1 className="font-display font-light text-ivory-50 leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}>
              Moments That<br /><em className="text-gradient-gold not-italic">Define You</em>
            </motion.h1>
            <motion.p className="font-body text-sm text-ivory-300/70 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: EASE }}>
              Six event spaces across the estate. Every event is entirely bespoke — our team begins with a blank page and your vision.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <div className="border-y border-obsidian-800/60">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-obsidian-800/60">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} className="py-7 px-6 text-center"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}>
                <p className="font-display text-4xl text-champagne-400 mb-1">{stat.value}</p>
                <p className="eyebrow text-2xs text-obsidian-500 tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Event types */}
      <div ref={bodyRef} className="section-container py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {EVENT_TYPES.map((ev, i) => {
            const Icon = ev.icon;
            return (
              <motion.div key={ev.title}
                className="border border-obsidian-800 p-6 hover:border-champagne-700/40 transition-all duration-300 group"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}>
                <div className="w-10 h-10 border border-champagne-700/30 flex items-center justify-center text-champagne-600 group-hover:text-champagne-400 group-hover:border-champagne-600/60 transition-all mb-5">
                  <Icon size={16} />
                </div>
                <h3 className="font-display text-xl text-ivory-200 mb-3">{ev.title}</h3>
                <p className="font-body text-xs text-obsidian-400 leading-relaxed mb-4">{ev.desc}</p>
                <div className="flex items-center gap-1.5 mb-5">
                  <Users size={11} className="text-champagne-700" />
                  <span className="eyebrow text-2xs text-obsidian-500">{ev.capacity}</span>
                </div>
                <Link href={ev.href} className="inline-flex items-center gap-1.5 eyebrow text-2xs text-champagne-600 hover:text-champagne-400 transition-colors">
                  Enquire <ArrowRight size={11} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Gallery strip */}
        <motion.div className="grid grid-cols-3 gap-3 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}>
          {[
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
          ].map((src, i) => (
            <div key={i} className="relative h-48 overflow-hidden">
              <Image src={src} alt={`Events ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="33vw" quality={80} />
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}>
          <p className="font-body text-sm text-obsidian-500 mb-5">
            Every event at Markland is entirely bespoke. Our team begins with a blank page.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-luxury-primary">Start Planning</Link>
            <Link href="/contact" className="btn-luxury-outline flex items-center gap-2">
              Speak to Concierge <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
