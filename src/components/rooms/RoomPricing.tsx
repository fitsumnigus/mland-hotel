"use client";

// src/components/rooms/RoomPricing.tsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Info, Check, Shield, Tag } from "lucide-react";
import type { RoomData } from "@/lib/data/rooms.data";
import { formatCurrency } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const INCLUSIONS = [
  "Full Irish breakfast for all guests",
  "Complimentary spa thermal access",
  "Twice-daily housekeeping",
  "24-hour room service",
  "Dedicated guest services team",
  "High-speed WiFi throughout",
  "Welcome amenity on arrival",
  "Late checkout on request (subject to availability)",
];

interface Props {
  room: RoomData;
}

export function RoomPricing({ room }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const weekdayRate  = room.baseRateWeekday;
  const weekendRate  = room.baseRateWeekend;
  const premiumDelta = weekendRate - weekdayRate;
  const taxRate      = 0.13;
  const weekdayTotal = weekdayRate * (1 + taxRate);
  const weekendTotal = weekendRate * (1 + taxRate);

  return (
    <div ref={ref} className="mb-14 pb-14 border-b border-obsidian-800/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-8"
      >
        <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.3em]">Rates & Inclusions</p>
        <h2 className="font-display text-3xl text-ivory-100 font-light">Pricing</h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rate cards */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          {/* Weekday */}
          <div className="border border-obsidian-700 p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="eyebrow text-2xs text-obsidian-500 mb-1">Mon – Thu</p>
                <p className="font-body text-sm text-ivory-400">Weekday Rate</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-ivory-100">{formatCurrency(weekdayRate)}</p>
                <p className="text-2xs text-obsidian-500 mt-0.5">excl. 13% VAT</p>
              </div>
            </div>
            <div className="h-px bg-obsidian-800 mb-3" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-obsidian-500 font-body">Total incl. VAT</span>
              <span className="font-display text-ivory-300">{formatCurrency(weekdayTotal)}</span>
            </div>
          </div>

          {/* Weekend */}
          <div className="border border-champagne-700/30 bg-champagne-900/5 p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="eyebrow text-2xs border border-champagne-700/40 text-champagne-500 px-2 py-0.5">
                Fri – Sun
              </span>
            </div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="eyebrow text-2xs text-champagne-700 mb-1">Fri – Sun</p>
                <p className="font-body text-sm text-ivory-400">Weekend Rate</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-ivory-100">{formatCurrency(weekendRate)}</p>
                <p className="text-2xs text-obsidian-500 mt-0.5">excl. 13% VAT</p>
              </div>
            </div>
            <div className="h-px bg-obsidian-800 mb-3" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-obsidian-500 font-body">Total incl. VAT</span>
              <span className="font-display text-ivory-300">{formatCurrency(weekendTotal)}</span>
            </div>
            {/* Weekend premium badge */}
            <div className="flex items-center gap-1.5 mt-3">
              <Tag size={10} className="text-champagne-700" />
              <span className="text-2xs text-obsidian-500">
                +{formatCurrency(premiumDelta)} weekend premium
              </span>
            </div>
          </div>

          {/* Booking note */}
          <div className="flex items-start gap-2.5 p-4 border border-obsidian-800 bg-obsidian-900/30">
            <Info size={13} className="text-obsidian-500 shrink-0 mt-0.5" />
            <p className="text-2xs text-obsidian-500 leading-relaxed">
              Rates shown are per room, per night. Minimum stay of 2 nights applies on weekends. Rates subject to availability and may vary during peak periods.
            </p>
          </div>
        </motion.div>

        {/* Inclusions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <div className="border border-obsidian-800 p-5 h-full">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={14} className="text-champagne-600" />
              <p className="eyebrow text-xs text-champagne-600 tracking-widest">Everything Included</p>
            </div>
            <div className="space-y-3">
              {INCLUSIONS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check size={12} className="text-champagne-600 mt-0.5 shrink-0" />
                  <p className="font-body text-sm text-obsidian-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-obsidian-800">
              <p className="text-2xs text-obsidian-500 leading-relaxed">
                All rates include complimentary continental breakfast. Full Irish breakfast available at supplement. Prices quoted in Euro (€).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
