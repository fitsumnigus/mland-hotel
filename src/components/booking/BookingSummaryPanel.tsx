"use client";

// src/components/booking/BookingSummaryPanel.tsx
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Users, BedDouble, Maximize2,
  Shield, Check, Info,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { BookingState, BookingStep } from "@/components/booking/BookingEngine";
import { formatCurrency, calculateTax } from "@/lib/utils";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const INCLUSIONS = [
  "Full Irish breakfast",
  "Spa thermal access",
  "24h room service",
  "Best rate guaranteed",
];

interface Props {
  state:       BookingState;
  currentStep: BookingStep;
}

export function BookingSummaryPanel({ state, currentStep }: Props) {
  const room = state.selectedRoom;
  const nights = state.checkIn && state.checkOut
    ? Math.max(0, differenceInDays(
        new Date(state.checkOut + "T12:00"),
        new Date(state.checkIn  + "T12:00")
      ))
    : 0;

  const rate     = room?.baseRateWeekday ?? 0;
  const subtotal = rate * nights;
  const tax      = calculateTax(subtotal);
  const total    = subtotal + tax;

  const hasRoom  = !!room;
  const hasDates = nights > 0;

  return (
    <div className="border border-obsidian-700 bg-obsidian-900/50 overflow-hidden">
      {/* Header */}
      <div className="border-b border-obsidian-800 px-5 py-4 bg-obsidian-900">
        <p className="eyebrow text-2xs text-champagne-600 tracking-widest mb-1">Your Booking</p>
        <p className="font-display text-lg text-ivory-100">Markland Hotel & Spa</p>
      </div>

      {/* Room preview */}
      <AnimatePresence mode="wait">
        {hasRoom ? (
          <motion.div
            key="room"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="border-b border-obsidian-800">
              <div className="relative h-36 w-full overflow-hidden">
                <Image
                  src={room.heroImage}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="380px"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="eyebrow text-2xs text-champagne-400 mb-0.5">{room.tierLabel}</p>
                  <p className="font-display text-lg text-ivory-100">{room.name}</p>
                </div>
              </div>
              <div className="px-5 py-3 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-2xs text-obsidian-400">
                  <Maximize2 size={10} className="text-champagne-700" /> {room.sizeM2} m²
                </span>
                <span className="flex items-center gap-1.5 text-2xs text-obsidian-400">
                  <BedDouble size={10} className="text-champagne-700" /> {room.features[0]}
                </span>
                <span className="flex items-center gap-1.5 text-2xs text-obsidian-400">
                  <Users size={10} className="text-champagne-700" /> Up to {room.maxOccupancy}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-room"
            className="px-5 py-6 border-b border-obsidian-800 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-body text-sm text-obsidian-500">No room selected yet</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stay details */}
      <div className="px-5 py-4 border-b border-obsidian-800 space-y-3">
        <SummaryRow icon={<CalendarDays size={12} />} label="Check In">
          {hasDates ? format(new Date(state.checkIn + "T12:00"), "EEE, d MMM yyyy") : "Not selected"}
        </SummaryRow>
        <SummaryRow icon={<CalendarDays size={12} />} label="Check Out">
          {hasDates ? format(new Date(state.checkOut + "T12:00"), "EEE, d MMM yyyy") : "Not selected"}
        </SummaryRow>
        <SummaryRow icon={<Users size={12} />} label="Guests">
          {state.adults} adult{state.adults > 1 ? "s" : ""}
          {state.children > 0 ? ` · ${state.children} child${state.children > 1 ? "ren" : ""}` : ""}
          {hasDates ? ` · ${nights} night${nights > 1 ? "s" : ""}` : ""}
        </SummaryRow>
      </div>

      {/* Price breakdown */}
      <AnimatePresence>
        {hasRoom && hasDates && (
          <motion.div
            className="px-5 py-4 border-b border-obsidian-800 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PriceLine label={`${formatCurrency(rate)} × ${nights} night${nights > 1 ? "s" : ""}`} value={formatCurrency(subtotal)} />
            <PriceLine label="VAT (13%)" value={formatCurrency(tax)} muted />
            <div className="border-t border-obsidian-800 pt-2 mt-2 flex items-center justify-between">
              <p className="font-body text-sm text-ivory-200 font-medium">Total</p>
              <p className="font-display text-2xl text-ivory-100">{formatCurrency(total)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-2xs text-obsidian-500 pt-1">
              <Info size={10} />
              Payment at hotel — no charge now
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inclusions */}
      <div className="px-5 py-4 border-b border-obsidian-800">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={12} className="text-champagne-600" />
          <p className="eyebrow text-2xs text-champagne-600 tracking-wider">All Stays Include</p>
        </div>
        <div className="space-y-2">
          {INCLUSIONS.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check size={10} className="text-champagne-700 shrink-0" />
              <p className="font-body text-xs text-obsidian-400">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="px-5 py-3 bg-obsidian-950/40">
        <p className="text-2xs text-obsidian-600">
          Need help?{" "}
          <a href="tel:+35312345678" className="text-champagne-600 hover:text-champagne-400 transition-colors">
            +353 1 234 5678
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function SummaryRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-champagne-700 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="eyebrow text-2xs text-obsidian-600 mb-0.5">{label}</p>
        <p className="font-body text-sm text-ivory-300 truncate">{children}</p>
      </div>
    </div>
  );
}

function PriceLine({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("font-body text-xs", muted ? "text-obsidian-500" : "text-obsidian-400")}>{label}</span>
      <span className={cn("font-body text-sm", muted ? "text-obsidian-500" : "text-ivory-200")}>{value}</span>
    </div>
  );
}
