"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { BedDouble, Maximize2, Users, ArrowRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useGSAP } from "@/hooks/useGSAP";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const ROOMS = [
  {
    id:      "deluxe-garden",
    slug:    "deluxe-garden-room",
    tier:    "Deluxe",
    name:    "Garden Room",
    tagline: "Morning light through Irish oak",
    desc:    "Wake to sculpted garden views from your king bed. Original stone fireplace, locally sourced linens, and a bathroom clad in Wicklow marble.",
    img:     "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85",
    imgAlt:  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85",
    size:    38,
    guests:  2,
    rate:    380,
    features: ["King Bed", "Garden View", "Marble Bath", "Fireplace"],
  },
  {
    id:      "junior-suite",
    slug:    "junior-suite",
    tier:    "Junior Suite",
    name:    "Wicklow Suite",
    tagline: "The estate countryside, framed",
    desc:    "A generous suite with separate sitting area, hand-thrown ceramics, rainfall shower, and private terrace overlooking the rolling valley.",
    img:     "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85",
    imgAlt:  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85",
    size:    55,
    guests:  2,
    rate:    620,
    features: ["King Bed", "Private Terrace", "Rain Shower", "Lounge Area"],
    featured: true,
  },
  {
    id:      "grand-suite",
    slug:    "grand-suite",
    tier:    "Grand Suite",
    name:    "Markland Grand",
    tagline: "Palatial. Quiet. Yours.",
    desc:    "Our most storied suite. Hand-painted ceiling murals, a claw-foot copper soaking tub, private dining room, and personal butler service.",
    img:     "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85",
    imgAlt:  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=85",
    size:    95,
    guests:  4,
    rate:    1200,
    features: ["Master Bedroom", "Copper Soaking Tub", "Butler Service", "Private Dining"],
  },
  {
    id:      "presidential",
    slug:    "presidential-suite",
    tier:    "Presidential",
    name:    "The Penthouse",
    tagline: "Summit of the estate",
    desc:    "A full-floor residence above the treetops. Wraparound terrace, chef's kitchen, private spa treatment room, and bespoke arrival ceremony.",
    img:     "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=1200&q=85",
    imgAlt:  "https://images.unsplash.com/photo-1561501878-aabd62634533?w=1200&q=85",
    size:    180,
    guests:  6,
    rate:    3800,
    features: ["Full Floor", "Private Terrace", "Chef's Kitchen", "Private Spa"],
  },
];

export function FeaturedRooms() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });
  const [active,  setActive]  = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);

  /* GSAP horizontal marquee on the eyebrow ticker */
  useGSAP(() => {
    // Dynamically import to avoid SSR issues
    const run = async () => {
      if (typeof window === "undefined") return;
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const ticker = sectionRef.current?.querySelector<HTMLElement>(".rooms-ticker");
      if (!ticker) return;
      gsap.to(ticker, {
        xPercent: -50,
        ease:     "none",
        duration: 20,
        repeat:   -1,
      });
    };
    run();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-obsidian-950 overflow-hidden">
      {/* Ticker strip */}
      <div className="border-y border-obsidian-800/60 py-3 overflow-hidden">
        <div className="rooms-ticker flex whitespace-nowrap w-max">
          {Array.from({ length: 2 }).map((_, ri) => (
            <span key={ri} className="inline-flex items-center gap-8 pr-8">
              {["Rooms & Suites", "•", "Spa & Wellness", "•", "Fine Dining", "•", "Private Events", "•", "Butler Service", "•", "Award-Winning", "•"].map((t, i) => (
                <span key={i} className={cn(
                  "eyebrow text-2xs tracking-[0.3em]",
                  t === "•" ? "text-champagne-800" : "text-obsidian-500"
                )}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="section-container pt-28 pb-16">
        <motion.div
          ref={headRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div>
            <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Rooms & Suites</p>
            <h2 className="font-display text-display-md lg:text-display-lg text-ivory-100 font-light leading-[0.95]">
              Your Private<br />
              <em className="text-gradient-gold not-italic">Sanctuary</em>
            </h2>
          </div>
          <div className="lg:max-w-xs">
            <p className="font-body text-sm text-obsidian-400 leading-relaxed mb-6">
              Each of our 48 rooms and suites is a study in considered luxury — hand-curated details, Irish craft, and views that change with every season.
            </p>
            <Link href="/rooms" className="inline-flex items-center gap-2 eyebrow text-xs text-champagne-500 hover:text-champagne-300 transition-colors group">
              View all accommodations
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Desktop — asymmetric featured layout */}
      <div className="hidden lg:block section-container pb-28">
        <div className="grid grid-cols-12 gap-4">
          {ROOMS.map((room, i) => {
            const isMain = i === active;

            return (
              <motion.div
                key={room.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-700 ease-out",
                  isMain ? "col-span-6" : "col-span-2"
                )}
                style={{ height: "540px" }}
                onClick={() => setActive(i)}
                onMouseEnter={() => setHovered(room.id)}
                onMouseLeave={() => setHovered(null)}
                layout
                transition={{ duration: 0.7, ease: EASE }}
              >
                {/* Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: hovered === room.id ? 1.04 : 1 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    <Image
                      src={room.img}
                      alt={room.name}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      quality={85}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/95 via-obsidian-950/30 to-transparent" />
                  {!isMain && (
                    <div className="absolute inset-0 bg-obsidian-950/40" />
                  )}
                </div>

                {/* Tier badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="eyebrow text-2xs bg-obsidian-950/60 backdrop-blur-sm border border-champagne-700/30 text-champagne-400 px-2.5 py-1 rounded-sm">
                    {room.tier}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                  <AnimatePresence>
                    {isMain ? (
                      <motion.div
                        key="main"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0  }}
                        exit={{   opacity: 0          }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="eyebrow text-2xs text-champagne-500 mb-2 tracking-widest">{room.tagline}</p>
                        <h3 className="font-display text-3xl text-ivory-100 mb-3 leading-tight">{room.name}</h3>
                        <p className="font-body text-sm text-ivory-300/70 mb-5 leading-relaxed max-w-sm">{room.desc}</p>
                        {/* Meta row */}
                        <div className="flex items-center gap-4 mb-5">
                          <RoomMeta icon={<Maximize2 size={11} />} label={`${room.size} m²`} />
                          <RoomMeta icon={<Users      size={11} />} label={`Up to ${room.guests}`} />
                          <RoomMeta icon={<BedDouble  size={11} />} label={room.features[0]} />
                        </div>
                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {room.features.map((f) => (
                            <span key={f} className="eyebrow text-2xs border border-obsidian-700 text-obsidian-400 px-2.5 py-1 rounded-sm">{f}</span>
                          ))}
                        </div>
                        {/* Rate + CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="eyebrow text-2xs text-obsidian-500 mb-0.5">From</p>
                            <p className="font-display text-2xl text-ivory-100">
                              {formatCurrency(room.rate)}
                              <span className="font-body text-xs text-obsidian-500 ml-1">/ night</span>
                            </p>
                          </div>
                          <Link
                            href={`/rooms/${room.slug}`}
                            className="btn-luxury-primary text-2xs py-2.5 px-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Suite
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="min"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{   opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="eyebrow text-2xs text-champagne-600 mb-1.5 tracking-widest">{room.tier}</p>
                        <h3 className="font-display text-lg text-ivory-200 leading-tight">{room.name}</h3>
                        <p className="font-body text-xs text-obsidian-500 mt-1">{formatCurrency(room.rate)} / night</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile — horizontal scroll cards */}
      <div className="lg:hidden pb-20">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 snap-x snap-mandatory">
          {ROOMS.map((room, i) => (
            <motion.div
              key={room.id}
              className="relative flex-shrink-0 w-[85vw] snap-center overflow-hidden rounded-sm"
              style={{ height: "480px" }}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            >
              <Image src={room.img} alt={room.name} fill className="object-cover" sizes="85vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/95 via-obsidian-950/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="eyebrow text-2xs bg-obsidian-900/80 border border-champagne-700/30 text-champagne-400 px-2.5 py-1 rounded-sm">{room.tier}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="eyebrow text-2xs text-champagne-500 mb-1">{room.tagline}</p>
                <h3 className="font-display text-2xl text-ivory-100 mb-3">{room.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="eyebrow text-2xs text-obsidian-500">From</p>
                    <p className="font-display text-xl text-ivory-100">{formatCurrency(room.rate)}<span className="font-body text-xs text-obsidian-500 ml-1">/ night</span></p>
                  </div>
                  <Link href={`/rooms/${room.slug}`} className="btn-luxury-primary text-2xs py-2.5 px-5">View</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomMeta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-2xs text-ivory-400">
      <span className="text-champagne-700">{icon}</span>
      {label}
    </span>
  );
}
