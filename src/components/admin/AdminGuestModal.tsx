"use client";

// src/components/admin/AdminGuestModal.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Mail, Phone, MapPin, Star,
  CalendarDays, Loader2, AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED:   "text-emerald-400 border-emerald-700/30",
  CHECKED_IN:  "text-blue-400 border-blue-700/30",
  CHECKED_OUT: "text-obsidian-400 border-obsidian-700",
  CANCELLED:   "text-red-400 border-red-700/30",
  PENDING:     "text-amber-400 border-amber-700/30",
};

const LOYALTY_COLORS: Record<string, string> = {
  CLASSIC:  "text-obsidian-400 border-obsidian-600",
  SILVER:   "text-slate-300 border-slate-600",
  GOLD:     "text-amber-300 border-amber-600/50",
  PLATINUM: "text-cyan-300 border-cyan-600/50",
};

interface GuestDetail {
  id:            string;
  email:         string;
  firstName:     string | null;
  lastName:      string | null;
  phone:         string | null;
  nationality:   string | null;
  loyaltyTier:   string;
  loyaltyPoints: number;
  createdAt:     string;
  bookings: {
    id:          string;
    reference:   string;
    status:      string;
    checkIn:     string;
    checkOut:    string;
    nights:      number;
    totalAmount: number;
    items:       { category: { name: string; tier: string } }[];
  }[];
  reviews: {
    id:        string;
    rating:    number;
    title:     string | null;
    published: boolean;
    createdAt: string;
  }[];
}

interface Props {
  guestId: string | null;
  onClose: () => void;
}

export function AdminGuestModal({ guestId, onClose }: Props) {
  const [guest,   setGuest]   = useState<GuestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = guestId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [guestId]);

  useEffect(() => {
    if (!guestId) { setGuest(null); return; }
    setLoading(true);
    setError(null);

    fetch(`/api/admin/guests/${guestId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setGuest(d.data);
        else setError(d.error ?? "Failed to load");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [guestId]);

  const totalSpend = guest?.bookings
    .filter((b) => !["CANCELLED","REFUNDED"].includes(b.status))
    .reduce((sum, b) => sum + b.totalAmount, 0) ?? 0;

  return (
    <AnimatePresence>
      {guestId && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-obsidian-950 border-l border-obsidian-800 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label="Guest profile"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-800 shrink-0">
              <p className="font-display text-xl text-ivory-100">Guest Profile</p>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center border border-obsidian-700 text-obsidian-400 hover:text-ivory-200 transition-all"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={24} className="animate-spin text-champagne-600" />
                </div>
              )}
              {error && (
                <div className="flex items-center gap-3 border border-red-700/40 bg-red-900/10 px-4 py-3 text-sm text-red-300">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}
              {guest && !loading && (
                <>
                  {/* Profile card */}
                  <div className="border border-obsidian-800 p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-champagne-900/30 border border-champagne-700/30 flex items-center justify-center text-champagne-400 font-display text-xl shrink-0">
                        {(guest.firstName?.[0] ?? guest.email[0]).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-xl text-ivory-100">
                          {guest.firstName} {guest.lastName}
                        </p>
                        <span className={cn(
                          "eyebrow text-2xs border px-2 py-0.5 mt-1 inline-block",
                          LOYALTY_COLORS[guest.loyaltyTier] ?? "text-obsidian-400 border-obsidian-700"
                        )}>
                          {guest.loyaltyTier} · {guest.loyaltyPoints.toLocaleString()} pts
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <InfoRow icon={<Mail size={12} />} label="Email">
                        <a href={`mailto:${guest.email}`} className="text-champagne-400 hover:text-champagne-300 transition-colors">
                          {guest.email}
                        </a>
                      </InfoRow>
                      {guest.phone && (
                        <InfoRow icon={<Phone size={12} />} label="Phone">{guest.phone}</InfoRow>
                      )}
                      {guest.nationality && (
                        <InfoRow icon={<MapPin size={12} />} label="Nationality">{guest.nationality}</InfoRow>
                      )}
                      <InfoRow icon={<CalendarDays size={12} />} label="Member Since">
                        {format(new Date(guest.createdAt), "d MMMM yyyy")}
                      </InfoRow>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Stays", value: guest.bookings.filter((b) => b.status === "CHECKED_OUT").length },
                      { label: "Total Spend", value: formatCurrency(totalSpend) },
                      { label: "Reviews", value: guest.reviews.length },
                    ].map((stat) => (
                      <div key={stat.label} className="border border-obsidian-800 p-3 text-center">
                        <p className="font-display text-xl text-ivory-100">{stat.value}</p>
                        <p className="eyebrow text-2xs text-obsidian-600 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Booking history */}
                  <div className="border border-obsidian-800">
                    <div className="px-4 py-2.5 border-b border-obsidian-800 bg-obsidian-900/30">
                      <p className="eyebrow text-2xs text-champagne-600 tracking-widest">Booking History</p>
                    </div>
                    {guest.bookings.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-obsidian-500 text-center">No bookings yet</p>
                    ) : (
                      <div className="divide-y divide-obsidian-800/40">
                        {guest.bookings.map((booking) => (
                          <div key={booking.id} className="px-4 py-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="eyebrow text-2xs text-champagne-600">{booking.reference}</p>
                              <p className="font-body text-sm text-ivory-300 mt-0.5">
                                {booking.items[0]?.category?.name ?? "—"}
                              </p>
                              <p className="text-xs text-obsidian-500 mt-0.5">
                                {format(new Date(booking.checkIn), "d MMM")} – {format(new Date(booking.checkOut), "d MMM yyyy")}
                                {" "}· {booking.nights}N
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={cn(
                                "eyebrow text-2xs border px-1.5 py-0.5 block mb-1",
                                STATUS_COLORS[booking.status] ?? "text-obsidian-400 border-obsidian-700"
                              )}>
                                {booking.status.replace(/_/g, " ")}
                              </span>
                              <p className="font-display text-base text-ivory-200">
                                {formatCurrency(booking.totalAmount)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reviews */}
                  {guest.reviews.length > 0 && (
                    <div className="border border-obsidian-800">
                      <div className="px-4 py-2.5 border-b border-obsidian-800 bg-obsidian-900/30">
                        <p className="eyebrow text-2xs text-champagne-600 tracking-widest">Reviews</p>
                      </div>
                      <div className="divide-y divide-obsidian-800/40">
                        {guest.reviews.map((review) => (
                          <div key={review.id} className="px-4 py-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={10} className={i < review.rating ? "text-champagne-400 fill-champagne-400" : "text-obsidian-700"} />
                                ))}
                              </div>
                              <span className={cn(
                                "eyebrow text-2xs",
                                review.published ? "text-emerald-400" : "text-obsidian-500"
                              )}>
                                {review.published ? "Published" : "Pending"}
                              </span>
                            </div>
                            {review.title && (
                              <p className="font-body text-sm text-ivory-300">{review.title}</p>
                            )}
                            <p className="text-xs text-obsidian-500 mt-0.5">
                              {format(new Date(review.createdAt), "d MMM yyyy")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-champagne-700 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="eyebrow text-2xs text-obsidian-600 mb-0.5">{label}</p>
        <p className="font-body text-sm text-ivory-200">{children}</p>
      </div>
    </div>
  );
}
