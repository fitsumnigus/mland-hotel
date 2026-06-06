"use client";

// src/components/rooms/RoomDetailClient.tsx
import React, { useRef } from "react";
import type { RoomData } from "@/lib/data/rooms.data";
import { RoomHero }            from "@/components/rooms/RoomHero";
import { RoomGallery }         from "@/components/rooms/RoomGallery";
import { RoomDescription }     from "@/components/rooms/RoomDescription";
import { RoomAmenities }       from "@/components/rooms/RoomAmenities";
import { RoomPricing }         from "@/components/rooms/RoomPricing";
import { RoomBookingSidebar }  from "@/components/rooms/RoomBookingSidebar";
import { RoomCard }            from "@/components/rooms/RoomCard";
import { motion, useInView }   from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Props {
  room:    RoomData;
  related: RoomData[];
}

export function RoomDetailClient({ room, related }: Props) {
  const bottomRef  = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const relInView  = useInView(relatedRef, { once: true, amount: 0.1 });

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* ── Full-bleed hero ───────────────────────────────────────── */}
      <RoomHero room={room} />

      {/* ── Main content + sidebar ────────────────────────────────── */}
      <div className="section-container py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start">

          {/* Left column — content */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <RoomGallery room={room} />

            {/* Description */}
            <RoomDescription room={room} />

            {/* Amenities */}
            <RoomAmenities room={room} />

            {/* Pricing breakdown */}
            <RoomPricing room={room} />

            {/* Anchor for sidebar bottom detection */}
            <div ref={bottomRef} className="h-1" />
          </div>

          {/* Right column — sticky booking sidebar */}
          <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0">
            <RoomBookingSidebar room={room} bottomRef={bottomRef} />
          </div>
        </div>
      </div>

      {/* ── Related rooms ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <div ref={relatedRef} className="border-t border-obsidian-800/60">
          <div className="section-container py-16 lg:py-20">
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={relInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="eyebrow text-xs text-champagne-500 mb-3 tracking-[0.3em]">Continue Exploring</p>
              <h2 className="font-display text-3xl lg:text-4xl text-ivory-100 font-light">You Might Also Like</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={relInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                >
                  <RoomCard room={r} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
