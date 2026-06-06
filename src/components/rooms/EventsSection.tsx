"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Calendar, Users, Mic2, Heart, Crown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const EVENT_TYPES = [
  {
    icon: Heart,
    title: "Weddings",
    desc:  "Ceremony and reception in our walled gardens or candlelit ballroom. Our events team orchestrates every detail.",
    capacity: "Up to 220 guests",
    href:  "/events/weddings",
  },
  {
    icon: Mic2,
    title: "Conferences",
    desc:  "Six flexible event spaces with state-of-the-art AV, high-speed connectivity, and dedicated coordinator.",
    capacity: "Up to 180 delegates",
    href:  "/events/conferences",
  },
  {
    icon: Crown,
    title: "Private Dining",
    desc:  "Exclusive use of The Grove or Cellars — perfect for board dinners, milestone celebrations, or product launches.",
    capacity: "Up to 80 guests",
    href:  "/events/private-dining",
  },
  {
    icon: Building2,
    title: "Retreats",
    desc:  "Multi-day corporate retreats with dedicated spa access, team-building activities, and bespoke catering.",
    capacity: "10 – 60 guests",
    href:  "/events/retreats",
  },
];

const STATS = [
  { value: "6",    label: "Event Spaces" },
  { value: "220",  label: "Max Capacity" },
  { value: "15+",  label: "Years Experience" },
  { value: "98%",  label: "Client Satisfaction" },
];

export function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const cardVariants = {
    hidden:  { opacity: 0, y: 32 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.12, duration: 0.65, ease: EASE },
    }),
  };

  return (
    <section ref={sectionRef} className="relative bg-obsidian-950 overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-champagne-700/25 to-transparent" />

      {/* Hero banner with parallax */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=85"
            alt="Markland ballroom events"
            fill
            className="object-cover scale-110"
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-obsidian-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/60 to-transparent" />

        {/* Decorative corner motif */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-champagne-600/30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-champagne-600/30" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-champagne-600/30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-champagne-600/30" />

        <div className="relative z-10 h-full flex items-center">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Meetings & Events</p>
              <h2 className="font-display text-display-md lg:text-display-lg text-ivory-100 font-light leading-[0.92]">
                Moments That<br />
                <em className="text-gradient-gold not-italic">Define You</em>
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-y border-obsidian-800/60">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-obsidian-800/60">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="py-7 px-6 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.55, ease: EASE }}
              >
                <p className="font-display text-4xl text-champagne-400 mb-1">{stat.value}</p>
                <p className="eyebrow text-2xs text-obsidian-500 tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Event type cards */}
      <div className="section-container py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EVENT_TYPES.map((ev, i) => {
            const Icon = ev.icon;
            return (
              <motion.div
                key={ev.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="group relative border border-obsidian-800 p-6 hover:border-champagne-700/40 transition-all duration-400 cursor-pointer overflow-hidden"
              >
                {/* Hover fill */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-champagne-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                />

                <div className="relative z-10">
                  <div className="w-10 h-10 border border-champagne-700/30 flex items-center justify-center text-champagne-600 group-hover:text-champagne-400 group-hover:border-champagne-600/60 transition-all mb-5">
                    <Icon size={16} />
                  </div>
                  <h3 className="font-display text-xl text-ivory-200 mb-3 group-hover:text-ivory-100 transition-colors">{ev.title}</h3>
                  <p className="font-body text-xs text-obsidian-400 leading-relaxed mb-4 group-hover:text-obsidian-300 transition-colors">{ev.desc}</p>
                  <div className="flex items-center gap-1.5 mb-5">
                    <Users size={11} className="text-champagne-700" />
                    <span className="eyebrow text-2xs text-obsidian-500">{ev.capacity}</span>
                  </div>
                  <Link
                    href={ev.href}
                    className="inline-flex items-center gap-1.5 eyebrow text-2xs text-champagne-600 group-hover:text-champagne-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Enquire <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
        >
          <p className="font-body text-sm text-obsidian-500 mb-5">
            Every event at Markland is entirely bespoke. Our team begins with a blank page.
          </p>
          <Link href="/events" className="btn-luxury-primary">Start Planning</Link>
        </motion.div>
      </div>
    </section>
  );
}
