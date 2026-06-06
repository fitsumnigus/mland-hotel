"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Users, Search, Minus, Plus, X } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/booking.store";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface GuestCount { adults: number; children: number; }

export function BookingBar() {
  const router    = useRouter();
  const setSearch = useBookingStore((s) => s.setSearchParams);

  const tomorrow = addDays(new Date(), 1);
  const initOut  = addDays(new Date(), 3);

  const [checkIn,   setCheckIn]   = useState<string>(format(tomorrow, "yyyy-MM-dd"));
  const [checkOut,  setCheckOut]  = useState<string>(format(initOut,  "yyyy-MM-dd"));
  const [guests,    setGuests]    = useState<GuestCount>({ adults: 2, children: 0 });
  const [guestOpen, setGuestOpen] = useState(false);
  const guestRef                  = useRef<HTMLDivElement>(null);

  const nights = differenceInDays(new Date(checkOut + "T12:00"), new Date(checkIn + "T12:00"));

  /* close guest dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setGuestOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateGuest = (key: keyof GuestCount, delta: number) => {
    setGuests((p) => ({
      ...p,
      [key]: Math.max(key === "adults" ? 1 : 0, Math.min(key === "adults" ? 6 : 4, p[key] + delta)),
    }));
  };

  const handleSearch = () => {
    setSearch({ checkIn, checkOut, adults: guests.adults, children: guests.children });
    router.push(`/book?checkIn=${checkIn}&checkOut=${checkOut}&adults=${guests.adults}&children=${guests.children}`);
  };

  const totalGuests = guests.adults + guests.children;

  return (
    <motion.div
      className="relative z-30 -mt-2"
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0,  opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
    >
      <div className="section-container">
        {/* Bar shell */}
        <div className="glass border border-champagne-800/20 shadow-luxury-lg overflow-visible">
          <div className="flex flex-col lg:flex-row">

            {/* ── Check-in ─────────────────────────────────────────── */}
            <Field label="Check In" icon={<CalendarDays size={13} className="text-champagne-700" />} className="lg:flex-1">
              <input
                type="date"
                value={checkIn}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  const cin  = new Date(e.target.value + "T12:00");
                  const cout = new Date(checkOut  + "T12:00");
                  if (cin >= cout) setCheckOut(format(addDays(cin, 1), "yyyy-MM-dd"));
                }}
                className="bg-transparent font-body text-sm text-ivory-200 focus:outline-none cursor-pointer w-full"
              />
              <p className="text-2xs text-obsidian-500 mt-0.5">
                {format(new Date(checkIn + "T12:00"), "EEEE, d MMM yyyy")}
              </p>
            </Field>

            <Divider />

            {/* ── Check-out ─────────────────────────────────────────── */}
            <Field label="Check Out" icon={<CalendarDays size={13} className="text-champagne-700" />} className="lg:flex-1">
              <input
                type="date"
                value={checkOut}
                min={format(addDays(new Date(checkIn + "T12:00"), 1), "yyyy-MM-dd")}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent font-body text-sm text-ivory-200 focus:outline-none cursor-pointer w-full"
              />
              <p className="text-2xs text-obsidian-500 mt-0.5">
                {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select checkout"}
              </p>
            </Field>

            <Divider />

            {/* ── Guests ───────────────────────────────────────────── */}
            <div ref={guestRef} className="relative lg:flex-1">
              <button
                onClick={() => setGuestOpen(!guestOpen)}
                className="w-full h-full text-left"
              >
                <Field
                  label="Guests"
                  icon={<Users size={13} className="text-champagne-700" />}
                  as="div"
                >
                  <p className="font-body text-sm text-ivory-200">
                    {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                  </p>
                  <p className="text-2xs text-obsidian-500 mt-0.5">
                    {guests.adults} adult{guests.adults > 1 ? "s" : ""}
                    {guests.children > 0 ? `, ${guests.children} child${guests.children > 1 ? "ren" : ""}` : ""}
                  </p>
                </Field>
              </button>

              {/* Guest dropdown */}
              {guestOpen && (
                <motion.div
                  className="absolute top-full left-0 w-72 mt-1 bg-obsidian-900/98 backdrop-blur-xl border border-obsidian-700 shadow-luxury-lg z-50 p-5 space-y-5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <GuestRow label="Adults" sub="Age 13+" value={guests.adults} min={1} max={6}
                    onChange={(d) => updateGuest("adults", d)} />
                  <GuestRow label="Children" sub="Ages 2–12" value={guests.children} min={0} max={4}
                    onChange={(d) => updateGuest("children", d)} />
                  <button
                    onClick={() => setGuestOpen(false)}
                    className="w-full text-center eyebrow text-2xs text-champagne-500 hover:text-champagne-300 pt-1 transition-colors flex items-center justify-center gap-1"
                  >
                    <X size={10} /> Done
                  </button>
                </motion.div>
              )}
            </div>

            {/* ── Search CTA ───────────────────────────────────────── */}
            <div className="p-3 lg:p-4 flex items-stretch border-t lg:border-t-0 lg:border-l border-obsidian-700/40">
              <motion.button
                onClick={handleSearch}
                className="btn-luxury-primary flex items-center gap-2 w-full lg:w-auto justify-center lg:px-10"
                whileHover={{ scale: 1.02 }}
                whileTap={{  scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Search size={13} />
                <span>Search</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Trust tags */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-5">
          {["Best rate guaranteed", "Free cancellation up to 48h", "Instant confirmation", "No booking fees"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-2xs tracking-wider text-obsidian-500">
              <span className="w-1 h-1 rounded-full bg-champagne-700" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function Divider() {
  return <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-obsidian-700/60 to-transparent my-4" />;
}

function Field({
  label, icon, children, className, as: Tag = "div",
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  as?: "div" | "label";
}) {
  return (
    <Tag className={cn(
      "px-5 py-4 lg:py-5 flex flex-col gap-0.5 border-t lg:border-t-0 border-obsidian-700/40 first:border-t-0 hover:bg-white/[0.02] transition-colors",
      className
    )}>
      <span className="flex items-center gap-1.5 eyebrow text-2xs text-champagne-600 mb-1">
        {icon}{label}
      </span>
      {children}
    </Tag>
  );
}

function GuestRow({
  label, sub, value, min, max, onChange,
}: {
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
          className="w-7 h-7 rounded-full border border-obsidian-700 flex items-center justify-center text-ivory-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-25 transition-all">
          <Minus size={10} />
        </button>
        <span className="font-body text-sm text-ivory-100 w-4 text-center tabular-nums">{value}</span>
        <button onClick={() => onChange(1)} disabled={value >= max}
          className="w-7 h-7 rounded-full border border-obsidian-700 flex items-center justify-center text-ivory-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-25 transition-all">
          <Plus size={10} />
        </button>
      </div>
    </div>
  );
}
