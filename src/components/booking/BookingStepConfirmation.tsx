"use client";

// src/components/booking/BookingStepConfirmation.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2, CalendarDays, Users, BedDouble,
  Mail, Phone, Printer, ArrowRight, Home,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { BookingState } from "@/components/booking/BookingEngine";
import { formatCurrency, calculateTax } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Props {
  state: BookingState;
}

export function BookingStepConfirmation({ state }: Props) {

  const room     = state.selectedRoom;
  const nights   = room ? Math.max(0, differenceInDays(
    new Date(state.checkOut + "T12:00"),
    new Date(state.checkIn  + "T12:00")
  )) : 0;
  const subtotal = (room?.baseRateWeekday ?? 0) * nights;
  const tax      = calculateTax(subtotal);
  const total    = subtotal + tax;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Animated check circle */}
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-champagne-500 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <CheckCircle2 size={32} className="text-champagne-400" />
          </motion.div>
        </motion.div>

        {/* Gold glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "radial-gradient(ellipse 40% 20% at 50% 20%, rgba(212,160,50,0.08) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-3 tracking-[0.4em]">Reservation Confirmed</p>
          <h1 className="font-display text-4xl lg:text-5xl text-ivory-100 font-light mb-4 leading-tight">
            We look forward<br />to welcoming you
          </h1>
          <p className="font-body text-sm text-obsidian-400 max-w-md mx-auto leading-relaxed">
            Your reservation is secured. A confirmation has been sent to{" "}
            <span className="text-ivory-300">{state.guest.email}</span>.
          </p>
        </motion.div>
      </motion.div>

      {/* Reference card */}
      <motion.div
        className="border border-champagne-700/40 bg-gradient-to-br from-champagne-900/15 to-obsidian-900/80 p-6 mb-6 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
      >
        {/* Corner ornaments */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-champagne-600/30" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-champagne-600/30" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-champagne-600/30" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-champagne-600/30" />

        <p className="eyebrow text-2xs text-obsidian-500 mb-2 tracking-widest">Booking Reference</p>
        <p className="font-display text-4xl lg:text-5xl text-champagne-300 tracking-[0.15em] mb-1">
          {state.confirmedReference ?? "MH-PENDING"}
        </p>
        <p className="text-2xs text-obsidian-500">Save this for your records</p>
      </motion.div>

      {/* Booking summary */}
      {room && (
        <motion.div
          className="border border-obsidian-700 overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        >
          {/* Room */}
          <div className="flex">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
              <Image src={room.heroImage} alt={room.name} fill className="object-cover" sizes="128px" quality={75} />
            </div>
            <div className="flex-1 p-4 border-b border-obsidian-800">
              <p className="eyebrow text-2xs text-champagne-600 mb-1">{room.tierLabel}</p>
              <h3 className="font-display text-xl text-ivory-100">{room.name}</h3>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-obsidian-800">
            <DetailCell icon={<CalendarDays size={12} />} label="Check In">
              {format(new Date(state.checkIn + "T12:00"), "d MMM yyyy")}
            </DetailCell>
            <DetailCell icon={<CalendarDays size={12} />} label="Check Out">
              {format(new Date(state.checkOut + "T12:00"), "d MMM yyyy")}
            </DetailCell>
            <DetailCell icon={<Users size={12} />} label="Guests">
              {state.adults + state.children} guests · {nights} nights
            </DetailCell>
            <DetailCell icon={<BedDouble size={12} />} label="Total">
              {formatCurrency(total)}
            </DetailCell>
          </div>

          {/* Guest info */}
          <div className="border-t border-obsidian-800 px-5 py-4 bg-obsidian-900/30">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-sm font-body text-ivory-300">
                <Users size={12} className="text-champagne-700" />
                {state.guest.firstName} {state.guest.lastName}
              </span>
              <span className="flex items-center gap-2 text-sm font-body text-ivory-300">
                <Mail size={12} className="text-champagne-700" />
                {state.guest.email}
              </span>
              {state.guest.phone && (
                <span className="flex items-center gap-2 text-sm font-body text-ivory-300">
                  <Phone size={12} className="text-champagne-700" />
                  {state.guest.phone}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* What's next */}
      <motion.div
        className="border border-obsidian-700 p-5 mb-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
      >
        <p className="eyebrow text-2xs text-champagne-600 tracking-widest mb-3">What Happens Next</p>
        {[
          { n: "1", text: "A confirmation email will arrive in your inbox within a few minutes." },
          { n: "2", text: "Our concierge team will reach out 48 hours before your arrival to personalise your stay." },
          { n: "3", text: "Check-in is from 3:00 PM. Our doorman will meet you on arrival." },
          { n: "4", text: "Payment is collected at the hotel. No charge is made to any card today." },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-start gap-4">
            <span className="font-display text-lg text-champagne-700 leading-none mt-0.5 shrink-0 w-5">{n}</span>
            <p className="font-body text-sm text-obsidian-300 leading-relaxed">{text}</p>
          </div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
      >
        <button
          onClick={() => window.print()}
          className="btn-luxury-outline flex items-center gap-2 text-xs"
        >
          <Printer size={13} /> Print Confirmation
        </button>
        <Link href="/rooms" className="btn-luxury-ghost flex items-center gap-2 text-xs">
          <Home size={13} /> Browse More Rooms
        </Link>
        <Link href="/" className="btn-luxury-primary flex items-center gap-2 text-xs">
          Return to Home <ArrowRight size={13} />
        </Link>
      </motion.div>

      {/* Contact line */}
      <motion.p
        className="text-center text-2xs text-obsidian-600 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Questions? Contact our reservations team at{" "}
        <a href="tel:+35312345678" className="text-champagne-600 hover:text-champagne-400 transition-colors">+353 1 234 5678</a>{" "}
        or{" "}
        <a href="mailto:reservations@marklandhotel.com" className="text-champagne-600 hover:text-champagne-400 transition-colors">reservations@marklandhotel.com</a>
      </motion.p>
    </div>
  );
}

function DetailCell({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-champagne-700">{icon}</span>
        <p className="eyebrow text-2xs text-obsidian-600">{label}</p>
      </div>
      <p className="font-body text-sm text-ivory-200">{children}</p>
    </div>
  );
}
