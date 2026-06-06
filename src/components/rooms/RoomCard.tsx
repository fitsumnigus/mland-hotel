"use client";

// src/components/rooms/RoomCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Users, BedDouble, ArrowRight } from "lucide-react";
import type { RoomData } from "@/lib/data/rooms.data";
import { formatCurrency, cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TIER_PALETTE: Record<string, string> = {
  DELUXE:       "text-stone-400 border-stone-700/40",
  SUPERIOR:     "text-stone-300 border-stone-600/40",
  JUNIOR_SUITE: "text-champagne-400 border-champagne-700/40",
  SUITE:        "text-champagne-300 border-champagne-600/40",
  GRAND_SUITE:  "text-amber-300 border-amber-600/40",
  PRESIDENTIAL: "text-yellow-200 border-yellow-500/40",
};

interface Props {
  room: RoomData;
  variant?: "default" | "compact" | "featured";
}

export function RoomCard({ room, variant = "default" }: Props) {
  const [hovered,    setHovered]    = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const [activeImg,  setActiveImg]  = useState(0);

  const tierStyle = TIER_PALETTE[room.tier] ?? "text-champagne-400 border-champagne-700/40";

  return (
    <Link href={`/rooms/${room.slug}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-500 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950">
      <motion.article
        className={cn(
          "relative overflow-hidden bg-obsidian-900 border border-obsidian-800 transition-colors duration-500",
          "hover:border-champagne-700/30"
        )}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* ── Image container ─────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ height: variant === "compact" ? "220px" : "300px" }}>
          {/* Main image */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Image
              src={room.heroImage}
              alt={room.name}
              fill
              className={cn("object-cover transition-opacity duration-500", imgLoaded ? "opacity-100" : "opacity-0")}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              onLoad={() => setImgLoaded(true)}
              quality={85}
            />
            {/* Skeleton */}
            {!imgLoaded && <div className="absolute inset-0 bg-obsidian-800 animate-pulse" />}
          </motion.div>

          {/* Hover secondary image */}
          <AnimatePresence>
            {hovered && room.galleryImages[1] && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={room.galleryImages[1]}
                  alt={`${room.name} detail`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  quality={80}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/20 to-transparent" />

          {/* Tier badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              "eyebrow text-2xs px-2.5 py-1 border bg-obsidian-900/70 backdrop-blur-sm",
              tierStyle
            )}>
              {room.tierLabel}
            </span>
          </div>

          {/* Featured tag */}
          {room.featured && (
            <div className="absolute top-4 right-4">
              <span className="eyebrow text-2xs px-2.5 py-1 bg-champagne-500/20 border border-champagne-500/30 text-champagne-300 backdrop-blur-sm">
                Featured
              </span>
            </div>
          )}

          {/* Gallery dots — visible on hover */}
          <AnimatePresence>
            {hovered && room.galleryImages.length > 1 && (
              <motion.div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {room.galleryImages.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setActiveImg(i); }}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      i === activeImg ? "bg-champagne-400 w-4" : "bg-white/40 hover:bg-white/70"
                    )}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        <div className="p-5 lg:p-6">
          {/* Tagline */}
          <p className="eyebrow text-2xs text-champagne-600 mb-2 tracking-widest">{room.tagline}</p>

          {/* Title + arrow */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-display text-xl lg:text-2xl text-ivory-100 leading-tight group-hover:text-champagne-200 transition-colors duration-300">
              {room.name}
            </h3>
            <motion.div
              animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 mt-1"
            >
              <ArrowRight size={16} className="text-champagne-400" />
            </motion.div>
          </div>

          {/* Short description */}
          <p className="font-body text-xs text-obsidian-400 leading-relaxed mb-4 line-clamp-2">
            {room.shortDesc}
          </p>

          {/* Meta strip */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-obsidian-800/60">
            <MetaBadge icon={<Maximize2 size={11} />} label={`${room.sizeM2} m²`} />
            <MetaBadge icon={<Users size={11} />} label={`Up to ${room.maxOccupancy}`} />
            <MetaBadge icon={<BedDouble size={11} />} label={room.features[0]} />
          </div>

          {/* Features pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.features.slice(0, 4).map((f) => (
              <span key={f} className="eyebrow text-2xs border border-obsidian-700/60 text-obsidian-500 px-2 py-0.5">
                {f}
              </span>
            ))}
            {room.features.length > 4 && (
              <span className="eyebrow text-2xs text-obsidian-600 px-2 py-0.5">
                +{room.features.length - 4} more
              </span>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-2xs text-obsidian-600 mb-0.5">From</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl text-ivory-100">
                  {formatCurrency(room.baseRateWeekday)}
                </span>
                <span className="font-body text-xs text-obsidian-500">/ night</span>
              </div>
            </div>

            <motion.div
              className="btn-luxury-primary text-2xs py-2.5 px-5"
              animate={{
                backgroundColor: hovered ? "hsl(38 65% 45%)" : "hsl(38 65% 51%)",
              }}
              transition={{ duration: 0.3 }}
            >
              View Suite
            </motion.div>
          </div>
        </div>

        {/* Bottom shimmer line on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-500 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </motion.article>
    </Link>
  );
}

function MetaBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-2xs text-obsidian-400">
      <span className="text-champagne-700">{icon}</span>
      {label}
    </span>
  );
}
