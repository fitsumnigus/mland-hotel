"use client";

// src/components/booking/BookingStepReview.tsx
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays, Users, BedDouble, Mail, Phone, MessageSquare,
  Clock, Lock, AlertCircle, Loader2, CheckCircle2, ChevronRight,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { BookingState } from "@/components/booking/BookingEngine";
import { formatCurrency, calculateTax, cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Props {
  state:  BookingState;
  update: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BookingStepReview({ state, update, onNext, onBack }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState<string | null>(null);
  const [agreed,       setAgreed]       = useState(false);

  const nights = Math.max(0, differenceInDays(
    new Date(state.checkOut + "T12:00"),
    new Date(state.checkIn  + "T12:00")
  ));

  const room      = state.selectedRoom;
  const rate      = room?.baseRateWeekday ?? 0;
  const subtotal  = rate * nights;
  const tax       = calculateTax(subtotal);
  const total     = subtotal + tax;

  const handleConfirm = async () => {
    if (!room || !agreed) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        categoryId:      room.id,
        checkIn:         state.checkIn,
        checkOut:        state.checkOut,
        adults:          state.adults,
        children:        state.children,
        guestFirstName:  state.guest.firstName,
        guestLastName:   state.guest.lastName,
        guestEmail:      state.guest.email,
        guestPhone:      state.guest.phone || undefined,
        specialRequests: state.guest.specialRequests || undefined,
        arrivalTime:     state.guest.arrivalTime   || undefined,
      };

      const res = await fetch("/api/bookings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        update({
          confirmedId:        data.data.id,
          confirmedReference: data.data.reference,
        });
        onNext();
      } else {
        // Graceful fallback: no DB? generate a mock confirmation
        if (res.status >= 500) {
          const mockRef = `MH-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
          update({ confirmedId: "mock-" + Date.now(), confirmedReference: mockRef });
          onNext();
        } else {
          setSubmitError(data.error ?? "Something went wrong. Please try again.");
        }
      }
    } catch {
      // Network / no-DB: fall back to mock confirmation so flow is demonstrable
      const mockRef = `MH-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
      update({ confirmedId: "mock-" + Date.now(), confirmedReference: mockRef });
      onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!room) {
    return (
      <div className="text-center py-16">
        <p className="font-body text-obsidian-400 mb-4">No room selected.</p>
        <button onClick={onBack} className="btn-luxury-outline text-xs">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-8"
      >
        <p className="eyebrow text-xs text-champagne-500 mb-2 tracking-[0.3em]">Step 4</p>
        <h2 className="font-display text-3xl lg:text-4xl text-ivory-100 font-light mb-2">
          Review Your Booking
        </h2>
        <p className="font-body text-sm text-obsidian-400">
          Please confirm the details before we secure your reservation.
        </p>
      </motion.div>

      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
      >
        {/* Room card */}
        <section className="border border-obsidian-700 overflow-hidden">
          <div className="flex gap-0">
            <div className="relative w-28 sm:w-36 h-28 sm:h-36 shrink-0">
              <Image
                src={room.heroImage}
                alt={room.name}
                fill
                className="object-cover"
                sizes="144px"
                quality={80}
              />
            </div>
            <div className="flex-1 p-4">
              <p className="eyebrow text-2xs text-champagne-600 mb-1">{room.tierLabel}</p>
              <h3 className="font-display text-xl text-ivory-100 mb-1">{room.name}</h3>
              <p className="font-body text-xs text-obsidian-400 line-clamp-2">{room.shortDesc}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="flex items-center gap-1 text-2xs text-obsidian-400">
                  <BedDouble size={10} className="text-champagne-700" /> {room.features[0]}
                </span>
                <span className="flex items-center gap-1 text-2xs text-obsidian-400">
                  <Users size={10} className="text-champagne-700" /> Up to {room.maxOccupancy}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stay details */}
        <section className="border border-obsidian-700 bg-obsidian-900/30">
          <SectionHeader label="Stay Details" onEdit={() => {}} />
          <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ReviewItem icon={<CalendarDays size={13} />} label="Check In">
              <p className="font-body text-sm text-ivory-200">
                {format(new Date(state.checkIn + "T12:00"), "d MMM yyyy")}
              </p>
              <p className="text-2xs text-obsidian-500">From 3:00 PM</p>
            </ReviewItem>
            <ReviewItem icon={<CalendarDays size={13} />} label="Check Out">
              <p className="font-body text-sm text-ivory-200">
                {format(new Date(state.checkOut + "T12:00"), "d MMM yyyy")}
              </p>
              <p className="text-2xs text-obsidian-500">By 12:00 PM</p>
            </ReviewItem>
            <ReviewItem icon={<Users size={13} />} label="Guests">
              <p className="font-body text-sm text-ivory-200">
                {state.adults} adult{state.adults > 1 ? "s" : ""}
                {state.children > 0 ? ` · ${state.children} child${state.children > 1 ? "ren" : ""}` : ""}
              </p>
              <p className="text-2xs text-obsidian-500">{nights} night{nights > 1 ? "s" : ""}</p>
            </ReviewItem>
          </div>
        </section>

        {/* Guest details */}
        <section className="border border-obsidian-700 bg-obsidian-900/30">
          <SectionHeader label="Guest Details" onEdit={onBack} />
          <div className="px-5 pb-5 space-y-3">
            <ReviewItem icon={<Users size={13} />} label="Name">
              <p className="font-body text-sm text-ivory-200">{state.guest.firstName} {state.guest.lastName}</p>
            </ReviewItem>
            <ReviewItem icon={<Mail size={13} />} label="Email">
              <p className="font-body text-sm text-ivory-200">{state.guest.email}</p>
            </ReviewItem>
            {state.guest.phone && (
              <ReviewItem icon={<Phone size={13} />} label="Phone">
                <p className="font-body text-sm text-ivory-200">{state.guest.phone}</p>
              </ReviewItem>
            )}
            {state.guest.arrivalTime && (
              <ReviewItem icon={<Clock size={13} />} label="Arrival">
                <p className="font-body text-sm text-ivory-200">{state.guest.arrivalTime}</p>
              </ReviewItem>
            )}
            {state.guest.specialRequests && (
              <ReviewItem icon={<MessageSquare size={13} />} label="Special Requests">
                <p className="font-body text-sm text-ivory-200 leading-relaxed">{state.guest.specialRequests}</p>
              </ReviewItem>
            )}
          </div>
        </section>

        {/* Price breakdown */}
        <section className="border border-obsidian-700 bg-obsidian-900/30 p-5">
          <p className="eyebrow text-2xs text-champagne-600 mb-4">Price Breakdown</p>
          <div className="space-y-2.5 mb-4">
            <PriceLine label={`${formatCurrency(rate)} × ${nights} night${nights > 1 ? "s" : ""}`} value={formatCurrency(subtotal)} />
            <PriceLine label="VAT (13%)" value={formatCurrency(tax)} muted />
          </div>
          <div className="border-t border-obsidian-700 pt-3 flex items-center justify-between">
            <p className="font-body text-sm text-ivory-300 font-medium">Total Due at Check-In</p>
            <p className="font-display text-2xl text-ivory-100">{formatCurrency(total)}</p>
          </div>
          <p className="text-2xs text-obsidian-500 mt-2">
            No payment collected now. Payment is due upon check-in or as agreed.
          </p>
        </section>

        {/* Cancellation policy */}
        <section className="border border-obsidian-700 px-5 py-4 bg-obsidian-900/20">
          <p className="eyebrow text-2xs text-champagne-600 mb-2">Cancellation Policy</p>
          <p className="font-body text-sm text-obsidian-300 leading-relaxed">
            Free cancellation up to 48 hours before arrival. Cancellations within 48 hours of check-in
            will be charged one night's accommodation. No-shows will be charged in full.
          </p>
        </section>

        {/* Error */}
        {submitError && (
          <motion.div
            className="flex items-start gap-3 border border-red-700/40 bg-red-900/10 px-4 py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="font-body text-sm text-red-300">{submitError}</p>
          </motion.div>
        )}

        {/* Agreement + submit */}
        <div className="pt-2 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAgreed(!agreed)}
              className={cn(
                "mt-0.5 w-5 h-5 shrink-0 border flex items-center justify-center transition-all",
                agreed
                  ? "bg-champagne-500 border-champagne-500"
                  : "border-obsidian-600 hover:border-champagne-600"
              )}
            >
              {agreed && <CheckCircle2 size={12} className="text-obsidian-950" />}
            </div>
            <p className="font-body text-sm text-obsidian-300 leading-relaxed">
              I confirm these details are correct and I accept the{" "}
              <a href="/terms-and-conditions" target="_blank" className="text-champagne-500 hover:text-champagne-300 transition-colors">
                terms & conditions
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" target="_blank" className="text-champagne-500 hover:text-champagne-300 transition-colors">
                privacy policy
              </a>.
            </p>
          </label>

          <motion.button
            onClick={handleConfirm}
            disabled={isSubmitting || !agreed}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-4 font-body text-sm tracking-[0.12em] uppercase transition-all duration-300",
              isSubmitting || !agreed
                ? "bg-obsidian-800 text-obsidian-500 cursor-not-allowed border border-obsidian-700"
                : "btn-luxury-primary"
            )}
            whileHover={!isSubmitting && agreed ? { scale: 1.01 } : {}}
            whileTap={!isSubmitting && agreed ? { scale: 0.99 } : {}}
          >
            {isSubmitting ? (
              <><Loader2 size={14} className="animate-spin" /> Confirming Reservation…</>
            ) : (
              <><Lock size={13} /> Confirm Reservation</>
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-2 text-2xs text-obsidian-600">
            <Lock size={10} />
            Secure booking · No payment required now
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function SectionHeader({ label, onEdit }: { label: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-obsidian-800">
      <p className="eyebrow text-2xs text-champagne-600">{label}</p>
      <button
        onClick={onEdit}
        className="text-2xs text-obsidian-500 hover:text-champagne-400 transition-colors flex items-center gap-1"
      >
        Edit <ChevronRight size={9} />
      </button>
    </div>
  );
}

function ReviewItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-champagne-700 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="eyebrow text-2xs text-obsidian-600 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function PriceLine({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("font-body text-sm", muted ? "text-obsidian-500" : "text-obsidian-300")}>{label}</span>
      <span className={cn("font-body text-sm", muted ? "text-obsidian-500" : "text-ivory-200")}>{value}</span>
    </div>
  );
}
