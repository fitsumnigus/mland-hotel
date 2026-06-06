"use client";

// src/components/booking/BookingStepSearch.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, ArrowRight, Minus, Plus, Info } from "lucide-react";
import { format, addDays, differenceInDays, isBefore } from "date-fns";
import type { BookingState } from "@/components/booking/BookingEngine";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const ARRIVAL_TIMES = [
  "Before 12:00", "12:00 – 14:00", "14:00 – 16:00",
  "16:00 – 18:00", "18:00 – 20:00", "20:00 – 22:00", "After 22:00",
];

interface Props {
  state:  BookingState;
  update: (patch: Partial<BookingState>) => void;
  onNext: () => void;
}

export function BookingStepSearch({ state, update, onNext }: Props) {
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [guestOpen, setGuestOpen] = useState(false);

  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const nights = state.checkIn && state.checkOut
    ? Math.max(0, differenceInDays(
        new Date(state.checkOut + "T12:00"),
        new Date(state.checkIn  + "T12:00")
      ))
    : 0;

  const handleCheckInChange = (val: string) => {
    update({ checkIn: val });
    const cin  = new Date(val + "T12:00");
    const cout = new Date(state.checkOut + "T12:00");
    if (!isBefore(cin, cout)) {
      update({ checkOut: format(addDays(cin, 1), "yyyy-MM-dd") });
    }
    setErrors((e) => ({ ...e, checkIn: "" }));
  };

  const handleCheckOutChange = (val: string) => {
    update({ checkOut: val });
    setErrors((e) => ({ ...e, checkOut: "" }));
  };

  const changeGuests = (key: "adults" | "children", delta: number) => {
    const limits = { adults: [1, 6], children: [0, 4] };
    const current = state[key];
    const [min, max] = limits[key];
    update({ [key]: Math.max(min, Math.min(max, current + delta)) });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!state.checkIn)  errs.checkIn = "Please select a check-in date";
    if (!state.checkOut) errs.checkOut = "Please select a check-out date";
    if (nights < 1)      errs.checkOut = "Check-out must be after check-in";
    if (nights > 30)     errs.checkOut = "Maximum stay is 30 nights";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const totalGuests = state.adults + state.children;

  return (
    <div className="max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className="eyebrow text-xs text-champagne-500 mb-2 tracking-[0.3em]">Step 1</p>
        <h2 className="font-display text-3xl lg:text-4xl text-ivory-100 font-light mb-2">
          When Are You Visiting?
        </h2>
        <p className="font-body text-sm text-obsidian-400 mb-8">
          Select your dates and we'll show you exactly what's available.
        </p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
      >
        {/* Dates row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DateInput
            label="Check In"
            value={state.checkIn}
            min={tomorrow}
            error={errors.checkIn}
            onChange={handleCheckInChange}
            helperText={state.checkIn ? format(new Date(state.checkIn + "T12:00"), "EEEE, d MMMM yyyy") : "Select date"}
          />
          <DateInput
            label="Check Out"
            value={state.checkOut}
            min={state.checkIn ? format(addDays(new Date(state.checkIn + "T12:00"), 1), "yyyy-MM-dd") : tomorrow}
            error={errors.checkOut}
            onChange={handleCheckOutChange}
            helperText={
              nights > 0
                ? `${nights} night${nights > 1 ? "s" : ""} · ${state.checkOut ? format(new Date(state.checkOut + "T12:00"), "EEEE, d MMMM yyyy") : ""}`
                : "Select date"
            }
          />
        </div>

        {/* Guests */}
        <div className="border border-obsidian-700 bg-obsidian-900/40">
          <button
            onClick={() => setGuestOpen(!guestOpen)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-obsidian-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users size={15} className="text-champagne-700 shrink-0" />
              <div>
                <p className="eyebrow text-2xs text-champagne-700 mb-0.5">Guests</p>
                <p className="font-body text-sm text-ivory-200">
                  {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
                  <span className="text-obsidian-500 ml-2 text-xs">
                    ({state.adults} adult{state.adults > 1 ? "s" : ""}
                    {state.children > 0 ? `, ${state.children} child${state.children > 1 ? "ren" : ""}` : ""})
                  </span>
                </p>
              </div>
            </div>
            <span className={cn(
              "text-xs text-champagne-600 transition-colors",
              guestOpen ? "text-champagne-400" : ""
            )}>
              {guestOpen ? "Done" : "Edit"}
            </span>
          </button>

          {guestOpen && (
            <motion.div
              className="border-t border-obsidian-800 px-5 py-4 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GuestCounter
                label="Adults"
                sub="Age 13 and over"
                value={state.adults}
                min={1}
                max={6}
                onChange={(d) => changeGuests("adults", d)}
              />
              <GuestCounter
                label="Children"
                sub="Ages 2 – 12"
                value={state.children}
                min={0}
                max={4}
                onChange={(d) => changeGuests("children", d)}
              />
              <div className="flex items-center gap-2 text-2xs text-obsidian-500 pt-1">
                <Info size={10} />
                Children under 2 stay free. Maximum occupancy varies by room.
              </div>
            </motion.div>
          )}
        </div>

        {/* Estimated arrival time */}
        <div className="border border-obsidian-700 bg-obsidian-900/40 px-5 py-4">
          <label className="block eyebrow text-2xs text-champagne-700 mb-2">
            Estimated Arrival Time <span className="text-obsidian-600 ml-1">(optional)</span>
          </label>
          <select
            value={state.guest.arrivalTime}
            onChange={(e) => update({ guest: { ...state.guest, arrivalTime: e.target.value } })}
            className="bg-transparent font-body text-sm text-ivory-200 focus:outline-none w-full cursor-pointer [&>option]:bg-obsidian-900 [&>option]:text-ivory-200"
          >
            <option value="">Not sure yet</option>
            {ARRIVAL_TIMES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <p className="text-2xs text-obsidian-600 mt-1.5">
            Check-in opens at 3pm. Early arrival subject to availability.
          </p>
        </div>

        {/* Night summary */}
        {nights > 0 && (
          <motion.div
            className="flex items-center gap-3 px-5 py-3 border border-champagne-800/30 bg-champagne-900/5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CalendarDays size={14} className="text-champagne-600 shrink-0" />
            <p className="font-body text-sm text-ivory-300">
              <span className="text-champagne-400 font-medium">{nights} night{nights > 1 ? "s" : ""}</span>
              {" "}· {format(new Date(state.checkIn + "T12:00"), "d MMM")} – {format(new Date(state.checkOut + "T12:00"), "d MMM yyyy")}
              {" "}· {totalGuests} guest{totalGuests > 1 ? "s" : ""}
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <div className="pt-2">
          <motion.button
            onClick={handleNext}
            className="btn-luxury-primary w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-10"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Search Available Rooms
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function DateInput({
  label, value, min, error, onChange, helperText,
}: {
  label: string; value: string; min: string; error?: string;
  onChange: (v: string) => void; helperText?: string;
}) {
  return (
    <div className={cn(
      "border px-5 py-4 transition-colors",
      error ? "border-red-700/60 bg-red-900/5" : "border-obsidian-700 bg-obsidian-900/40 hover:border-obsidian-600"
    )}>
      <div className="flex items-center gap-2 mb-1.5">
        <CalendarDays size={12} className="text-champagne-700 shrink-0" />
        <p className="eyebrow text-2xs text-champagne-700">{label}</p>
      </div>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="bg-transparent font-body text-base text-ivory-200 focus:outline-none w-full cursor-pointer mb-1"
      />
      {error ? (
        <p className="text-2xs text-red-400">{error}</p>
      ) : (
        <p className="text-2xs text-obsidian-500">{helperText}</p>
      )}
    </div>
  );
}

function GuestCounter({
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(-1)}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="w-8 h-8 border border-obsidian-600 flex items-center justify-center text-ivory-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-25 transition-all"
        >
          <Minus size={11} />
        </button>
        <span className="font-display text-lg text-ivory-100 w-5 text-center tabular-nums leading-none">
          {value}
        </span>
        <button
          onClick={() => onChange(1)}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="w-8 h-8 border border-obsidian-600 flex items-center justify-center text-ivory-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-25 transition-all"
        >
          <Plus size={11} />
        </button>
      </div>
    </div>
  );
}
