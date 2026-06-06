"use client";

// src/components/rooms/RoomBookingSidebar.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Users, Plus, Minus, AlertCircle,
  CheckCircle2, Loader2, ArrowRight, Phone, Lock,
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import type { RoomData } from "@/lib/data/rooms.data";
import { useAvailability }      from "@/hooks/useAvailability";
import { useStickyScroll }      from "@/hooks/useStickyScroll";
import { formatCurrency, cn, calculateTax } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Props {
  room:      RoomData;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export function RoomBookingSidebar({ room, bottomRef }: Props) {
  const router = useRouter();

  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const dayAfter  = format(addDays(new Date(), 3), "yyyy-MM-dd");

  const [checkIn,  setCheckIn]  = useState(tomorrow);
  const [checkOut, setCheckOut] = useState(dayAfter);
  const [adults,   setAdults]   = useState(2);
  const [children, setChildren] = useState(0);
  const [guestOpen, setGuestOpen] = useState(false);

  const { isSticky, isAtBottom } = useStickyScroll({ topOffset: 88, bottomBound: bottomRef });

  const nights = Math.max(0, differenceInDays(
    new Date(checkOut + "T12:00"),
    new Date(checkIn  + "T12:00")
  ));

  const { results, isLoading, error: availError } = useAvailability({
    checkIn:  nights > 0 ? checkIn : null,
    checkOut: nights > 0 ? checkOut : null,
    adults,
    children,
    enabled:  nights > 0,
  });

  const roomResult   = results.find((r) => r.categoryId === room.id || r.categoryName === room.name);
  // null = not yet checked, true/false = actual result
  const isAvailable: boolean | null = nights < 1
    ? null
    : isLoading
    ? null
    : roomResult
    ? roomResult.available
    : availError
    ? null   // error → show static rates, don't block
    : null;  // no DB / no results → don't block CTA
  const ratePerNight = roomResult?.ratePerNight ?? room.baseRateWeekday;
  const subtotal     = ratePerNight * nights;
  const tax          = calculateTax(subtotal);
  const total        = subtotal + tax;

  const handleReserve = () => {
    const params = new URLSearchParams({
      roomId:   room.id,
      slug:     room.slug,
      checkIn,
      checkOut,
      adults:   String(adults),
      children: String(children),
    });
    router.push(`/book?${params}`);
  };

  // Prevent checkout before checkin
  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    const cin  = new Date(val   + "T12:00");
    const cout = new Date(checkOut + "T12:00");
    if (cin >= cout) setCheckOut(format(addDays(cin, 1), "yyyy-MM-dd"));
  };

  const sidebarContent = (
    <div className="border border-obsidian-700 bg-obsidian-900 shadow-luxury-lg overflow-visible">
      {/* Header */}
      <div className="border-b border-obsidian-800 px-5 py-4">
        <p className="eyebrow text-2xs text-champagne-600 tracking-widest mb-1">{room.tierLabel}</p>
        <h3 className="font-display text-xl text-ivory-100">{room.name}</h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-body text-xs text-obsidian-500">From</span>
          <span className="font-display text-2xl text-ivory-100">{formatCurrency(room.baseRateWeekday)}</span>
          <span className="font-body text-xs text-obsidian-500">/ night</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Date inputs */}
        <div className="grid grid-cols-2 gap-2">
          <DateField
            label="Check In"
            value={checkIn}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={handleCheckInChange}
          />
          <DateField
            label="Check Out"
            value={checkOut}
            min={format(addDays(new Date(checkIn + "T12:00"), 1), "yyyy-MM-dd")}
            onChange={setCheckOut}
          />
        </div>

        {/* Guests */}
        <div className="relative">
          <button
            onClick={() => setGuestOpen(!guestOpen)}
            className="w-full border border-obsidian-700 px-3 py-3 text-left hover:border-obsidian-600 transition-colors"
          >
            <p className="eyebrow text-2xs text-champagne-700 mb-1">Guests</p>
            <p className="font-body text-sm text-ivory-200">
              {adults + children} {adults + children === 1 ? "guest" : "guests"}
              <span className="text-obsidian-500 ml-1">({adults} adult{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} child${children > 1 ? "ren" : ""}` : ""})</span>
            </p>
          </button>
          <AnimatePresence>
            {guestOpen && (
              <motion.div
                className="absolute left-0 right-0 top-full mt-1 bg-obsidian-800 border border-obsidian-700 p-4 space-y-4 z-50 shadow-luxury-lg"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <GuestRow label="Adults" sub="Age 13+" value={adults} min={1} max={room.maxAdults}
                  onChange={(d) => setAdults((p) => Math.max(1, Math.min(room.maxAdults, p + d)))} />
                <GuestRow label="Children" sub="Ages 2–12" value={children} min={0} max={room.maxChildren}
                  onChange={(d) => setChildren((p) => Math.max(0, Math.min(room.maxChildren, p + d)))} />
                <p className="text-2xs text-obsidian-500">Max occupancy: {room.maxOccupancy} guests</p>
                <button onClick={() => setGuestOpen(false)}
                  className="w-full text-center eyebrow text-2xs text-champagne-500 hover:text-champagne-300 py-1 transition-colors">
                  Done ✓
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Availability status */}
        <AnimatePresence mode="wait">
          {nights > 0 && (
            <motion.div
              key={isLoading ? "loading" : isAvailable === null ? "idle" : isAvailable ? "avail" : "unavail"}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-xs text-obsidian-400 border border-obsidian-700 px-3 py-2.5">
                  <Loader2 size={12} className="animate-spin text-champagne-600" />
                  Checking availability…
                </div>
              ) : availError ? (
                <div className="flex items-center gap-2 text-xs text-amber-400/70 border border-amber-800/30 bg-amber-900/5 px-3 py-2.5">
                  <AlertCircle size={12} />
                  Showing estimated rates
                </div>
              ) : isAvailable === true ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 border border-emerald-800/30 bg-emerald-900/10 px-3 py-2.5">
                  <CheckCircle2 size={12} />
                  Available for your dates
                  {roomResult && <span className="ml-auto text-obsidian-500">{roomResult.availableCount} left</span>}
                </div>
              ) : isAvailable === false ? (
                <div className="flex items-center gap-2 text-xs text-red-400 border border-red-800/30 bg-red-900/10 px-3 py-2.5">
                  <AlertCircle size={12} />
                  Not available — try different dates
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price breakdown */}
        <AnimatePresence>
          {nights > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-t border-obsidian-800 pt-4 space-y-2"
            >
              <div className="flex justify-between text-xs font-body">
                <span className="text-obsidian-400">{formatCurrency(ratePerNight)} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span className="text-ivory-300">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-body">
                <span className="text-obsidian-400">VAT (13%)</span>
                <span className="text-ivory-300">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-body border-t border-obsidian-800 pt-2 mt-2">
                <span className="text-ivory-200 font-medium">Total</span>
                <span className="font-display text-xl text-ivory-100">{formatCurrency(total)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reserve CTA */}
        <motion.button
          onClick={handleReserve}
          disabled={nights < 1 || isAvailable === false}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-4 font-body text-sm tracking-[0.12em] uppercase transition-all duration-300",
            nights < 1
              ? "bg-obsidian-800 text-obsidian-500 cursor-not-allowed"
              : isAvailable === false
              ? "bg-obsidian-800 text-obsidian-500 cursor-not-allowed"
              : "btn-luxury-primary"
          )}
          whileHover={nights > 0 && isAvailable !== false ? { scale: 1.01 } : {}}
          whileTap={nights > 0 && isAvailable !== false ? { scale: 0.99 } : {}}
        >
          {nights < 1 ? "Select Dates" : isAvailable === false ? "Not Available" : (
            <>Reserve Now <ArrowRight size={13} /></>
          )}
        </motion.button>

        {/* Trust signals */}
        <div className="space-y-2 pt-1">
          <TrustLine icon={<Lock size={10} />} text="Best rate guaranteed when you book direct" />
          <TrustLine icon={<CheckCircle2 size={10} />} text="Free cancellation up to 48h before arrival" />
          <TrustLine icon={<Phone size={10} />} text="Questions? Call +353 1 234 5678" />
        </div>
      </div>

      {/* Concierge footer */}
      <div className="border-t border-obsidian-800 px-5 py-3 bg-obsidian-950/50 flex items-center justify-between">
        <p className="text-2xs text-obsidian-500">Need help? Our reservations team is available 24/7.</p>
        <a href="tel:+35312345678" className="eyebrow text-2xs text-champagne-600 hover:text-champagne-400 transition-colors whitespace-nowrap ml-3">
          Call us
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div
        className={cn(
          "hidden lg:block transition-all duration-300",
          isSticky && !isAtBottom ? "sticky top-24" : ""
        )}
      >
        {sidebarContent}
      </div>

      {/* Mobile floating CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-obsidian-950/95 backdrop-blur-md border-t border-obsidian-800 p-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="font-body text-xs text-obsidian-400">From</p>
          <p className="font-display text-xl text-ivory-100">{formatCurrency(room.baseRateWeekday)}<span className="font-body text-xs text-obsidian-500 ml-1">/ night</span></p>
        </div>
        <button
          onClick={handleReserve}
          className="btn-luxury-primary py-3 px-6 flex items-center gap-2"
        >
          Book Now <ArrowRight size={13} />
        </button>
      </div>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function DateField({ label, value, min, onChange }: {
  label: string; value: string; min: string; onChange: (v: string) => void;
}) {
  return (
    <div className="border border-obsidian-700 px-3 py-2.5 hover:border-obsidian-600 transition-colors">
      <div className="flex items-center gap-1.5 mb-1">
        <CalendarDays size={10} className="text-champagne-700" />
        <p className="eyebrow text-2xs text-champagne-700">{label}</p>
      </div>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="bg-transparent font-body text-sm text-ivory-200 focus:outline-none w-full cursor-pointer"
      />
    </div>
  );
}

function GuestRow({ label, sub, value, min, max, onChange }: {
  label: string; sub: string; value: number; min: number; max: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-body text-sm text-ivory-200">{label}</p>
        <p className="text-2xs text-obsidian-500">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(-1)} disabled={value <= min}
          className="w-7 h-7 border border-obsidian-600 flex items-center justify-center text-ivory-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-25 transition-all">
          <Minus size={10} />
        </button>
        <span className="font-body text-sm text-ivory-100 w-5 text-center tabular-nums">{value}</span>
        <button onClick={() => onChange(1)} disabled={value >= max}
          className="w-7 h-7 border border-obsidian-600 flex items-center justify-center text-ivory-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-25 transition-all">
          <Plus size={10} />
        </button>
      </div>
    </div>
  );
}

function TrustLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-2xs text-obsidian-500">
      <span className="text-champagne-800 shrink-0">{icon}</span>
      {text}
    </div>
  );
}
