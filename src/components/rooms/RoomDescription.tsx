"use client";

// src/components/rooms/RoomDescription.tsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { RoomData } from "@/lib/data/rooms.data";
import { BedDouble, Maximize2, Users, Layers } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Props {
  room: RoomData;
}

export function RoomDescription({ room }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const specs = [
    { icon: <Maximize2 size={14} />, label: "Room Size",     value: `${room.sizeM2} m²` },
    { icon: <Users     size={14} />, label: "Max Guests",    value: `${room.maxOccupancy} guests` },
    { icon: <BedDouble size={14} />, label: "Bed Type",      value: room.features[0] },
    { icon: <Layers    size={14} />, label: "Floor Range",   value: `Floors ${room.floorMin}–${room.floorMax}` },
  ];

  return (
    <div ref={ref} className="mb-14 pb-14 border-b border-obsidian-800/60">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-8"
      >
        <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.3em]">About This Suite</p>
        <h2 className="font-display text-3xl lg:text-4xl text-ivory-100 font-light leading-tight mb-3">
          {room.name}
        </h2>
        <span className="gold-line" />
      </motion.div>

      {/* Spec cards */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
      >
        {specs.map((spec) => (
          <div key={spec.label} className="border border-obsidian-800 p-4 flex flex-col gap-2">
            <span className="text-champagne-700">{spec.icon}</span>
            <p className="eyebrow text-2xs text-obsidian-500">{spec.label}</p>
            <p className="font-body text-sm text-ivory-300 font-medium">{spec.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Description text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
      >
        <p className="font-body text-sm text-obsidian-300 leading-[1.9] mb-5">
          {room.description}
        </p>

        {/* Features list */}
        <div className="flex flex-wrap gap-2 mt-5">
          {room.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 eyebrow text-2xs border border-champagne-700/30 text-champagne-500/80 px-3 py-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-champagne-600" />
              {f}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
