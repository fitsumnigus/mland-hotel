"use client";

// src/components/booking/BookingStepGuest.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare, Clock, ArrowRight } from "lucide-react";
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

type GuestField = keyof BookingState["guest"];

export function BookingStepGuest({ state, update, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<GuestField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<GuestField, boolean>>>({});

  const setField = (field: GuestField, value: string) => {
    update({ guest: { ...state.guest, [field]: value } });
    if (touched[field]) validate({ ...state.guest, [field]: value });
  };

  const markTouched = (field: GuestField) => {
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const validate = (guest = state.guest) => {
    const errs: Partial<Record<GuestField, string>> = {};
    if (!guest.firstName.trim())         errs.firstName = "First name is required";
    if (!guest.lastName.trim())          errs.lastName  = "Last name is required";
    if (!guest.email.trim())             errs.email     = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email))
                                         errs.email     = "Please enter a valid email";
    if (guest.phone && !/^\+?[\d\s\-().]{7,20}$/.test(guest.phone))
                                         errs.phone     = "Please enter a valid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setTouched({ firstName: true, lastName: true, email: true, phone: true });
    if (validate()) onNext();
  };

  const g = state.guest;

  return (
    <div className="max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-8"
      >
        <p className="eyebrow text-xs text-champagne-500 mb-2 tracking-[0.3em]">Step 3</p>
        <h2 className="font-display text-3xl lg:text-4xl text-ivory-100 font-light mb-2">
          Your Details
        </h2>
        <p className="font-body text-sm text-obsidian-400">
          We'll use these to confirm your reservation and welcome you personally.
        </p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
      >
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="First Name"
            required
            icon={<User size={12} />}
            error={errors.firstName}
          >
            <input
              type="text"
              value={g.firstName}
              placeholder="James"
              autoComplete="given-name"
              onChange={(e) => setField("firstName", e.target.value)}
              onBlur={() => markTouched("firstName")}
              className={fieldClass(!!errors.firstName)}
            />
          </FormField>
          <FormField
            label="Last Name"
            required
            error={errors.lastName}
          >
            <input
              type="text"
              value={g.lastName}
              placeholder="Thornton"
              autoComplete="family-name"
              onChange={(e) => setField("lastName", e.target.value)}
              onBlur={() => markTouched("lastName")}
              className={fieldClass(!!errors.lastName)}
            />
          </FormField>
        </div>

        {/* Email */}
        <FormField label="Email Address" required icon={<Mail size={12} />} error={errors.email}>
          <input
            type="email"
            value={g.email}
            placeholder="james@example.com"
            autoComplete="email"
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => markTouched("email")}
            className={fieldClass(!!errors.email)}
          />
        </FormField>

        {/* Phone */}
        <FormField label="Phone Number" icon={<Phone size={12} />} error={errors.phone}>
          <input
            type="tel"
            value={g.phone}
            placeholder="+353 1 234 5678"
            autoComplete="tel"
            onChange={(e) => setField("phone", e.target.value)}
            onBlur={() => markTouched("phone")}
            className={fieldClass(!!errors.phone)}
          />
        </FormField>

        {/* Arrival time */}
        <FormField label="Estimated Arrival" icon={<Clock size={12} />}>
          <select
            value={g.arrivalTime}
            onChange={(e) => setField("arrivalTime", e.target.value)}
            className={cn(fieldClass(false), "cursor-pointer [&>option]:bg-obsidian-900 [&>option]:text-ivory-200")}
          >
            <option value="">I'm not sure yet</option>
            {ARRIVAL_TIMES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <p className="text-2xs text-obsidian-600 mt-1.5 px-1">
            Check-in from 3pm. Early arrival subject to availability.
          </p>
        </FormField>

        {/* Special requests */}
        <FormField label="Special Requests" icon={<MessageSquare size={12} />}>
          <textarea
            value={g.specialRequests}
            placeholder="Dietary requirements, room preferences, celebration details, or anything else we should know…"
            rows={4}
            onChange={(e) => setField("specialRequests", e.target.value)}
            className={cn(fieldClass(false), "resize-none leading-relaxed")}
          />
          <p className="text-2xs text-obsidian-600 mt-1.5 px-1">
            We will do our best to accommodate all requests, though cannot guarantee them.
          </p>
        </FormField>

        {/* Privacy note */}
        <div className="border border-obsidian-800 px-4 py-3 bg-obsidian-900/30">
          <p className="text-2xs text-obsidian-500 leading-relaxed">
            Your details are used solely to manage your reservation and personalise your stay. We do not share your information with third parties. See our{" "}
            <a href="/privacy-policy" className="text-champagne-600 hover:text-champagne-400 transition-colors" target="_blank">
              Privacy Policy
            </a>{" "}
            for more information.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <motion.button
            onClick={handleNext}
            className="btn-luxury-primary w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-10"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Continue to Review
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function fieldClass(hasError: boolean) {
  return cn(
    "w-full bg-transparent font-body text-sm text-ivory-200 placeholder:text-obsidian-600",
    "focus:outline-none py-2 px-0 border-0",
    hasError ? "text-red-200" : ""
  );
}

function FormField({
  label, required, icon, error, children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "border px-4 py-3 transition-colors",
      error ? "border-red-700/50 bg-red-900/5" : "border-obsidian-700 bg-obsidian-900/40 focus-within:border-champagne-700/60"
    )}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon && <span className="text-champagne-700">{icon}</span>}
        <label className="eyebrow text-2xs text-champagne-700">
          {label}
          {required && <span className="text-champagne-600 ml-0.5">*</span>}
        </label>
      </div>
      {children}
      {error && <p className="text-2xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
