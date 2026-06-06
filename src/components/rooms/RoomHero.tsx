"use client";

// src/components/rooms/RoomHero.tsx
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, Maximize2, Users, BedDouble } from "lucide-react";
import type { RoomData } from "@/lib/data/rooms.data";
import { formatCurrency } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TIER_COLORS: Record<string, string> = {
  DELUXE:       "from-stone-900/70",
  SUPERIOR:     "from-stone-900/70",
  JUNIOR_SUITE: "from-amber-950/70",
  SUITE:        "from-amber-950/60",
  GRAND_SUITE:  "from-amber-950/60",
  PRESIDENTIAL: "from-yellow-950/60",
};

interface Props {
  room: RoomData;
}

export function RoomHero({ room }: Props) {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset:  ["start start", "end start"],
  });

  const imgY    = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const gradientFrom = TIER_COLORS[room.tier] ?? "from-obsidian-950/70";

  return (
    <section ref={heroRef} className="relative h-[70vh] min-h-[520px] lg:h-[85vh] overflow-hidden bg-obsidian-950">
      {/* Parallax image */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
        <Image
          src={room.heroImage}
          alt={room.name}
          fill
          priority
          className="object-cover scale-110"
          sizes="100vw"
          quality={90}
        />
      </motion.div>

      {/* Layered overlays */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} via-obsidian-950/30 to-transparent`} />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/70 via-obsidian-950/20 to-transparent" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(13,11,10,0.5) 100%)" }} />

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />

      {/* Content */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-end"
        style={{ y: textY, opacity }}
      >
        <div className="section-container pb-12 lg:pb-16">
          {/* Back nav */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-xs text-ivory-400/60 hover:text-ivory-200 transition-colors font-body tracking-wider group"
            >
              <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Rooms & Suites
            </Link>
          </motion.div>

          {/* Tier + name */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <p className="eyebrow text-xs text-champagne-400 mb-3 tracking-[0.35em]">{room.tierLabel}</p>
            <h1 className="font-display font-light text-ivory-50 leading-[0.9] mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}>
              {room.name}
            </h1>
            <p className="font-body text-sm text-ivory-300/70 mb-8 max-w-lg leading-relaxed">
              {room.tagline}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-6">
              <QuickStat icon={<Maximize2 size={13} />} label={`${room.sizeM2} m²`} />
              <QuickStat icon={<Users size={13} />}     label={`Up to ${room.maxOccupancy} guests`} />
              <QuickStat icon={<BedDouble size={13} />} label={room.features[0]} />
              <div className="h-4 w-px bg-ivory-300/20 hidden sm:block" />
              <div>
                <span className="font-body text-xs text-ivory-300/50">From </span>
                <span className="font-display text-2xl text-ivory-100">{formatCurrency(room.baseRateWeekday)}</span>
                <span className="font-body text-xs text-ivory-300/50"> / night</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-5 right-8 z-10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="eyebrow text-2xs text-ivory-400/40">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-transparent via-champagne-600/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

function QuickStat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 text-sm text-ivory-300/70 font-body">
      <span className="text-champagne-600">{icon}</span>
      {label}
    </span>
  );
}
