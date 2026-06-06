"use client";

// src/components/admin/AdminBookingModal.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Mail, Phone, CalendarDays, BedDouble,
  CreditCard, MessageSquare, CheckCircle2, XCircle,
  LogIn, LogOut, Loader2, AlertCircle, Clock,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const STATUS_ACTIONS: Record<string, { label: string; next: string; icon: React.ReactNode; color: string }[]> = {
  PENDING:    [{ label: "Confirm",    next: "CONFIRMED",   icon: <CheckCircle2 size={12} />, color: "btn-luxury-primary text-xs" }],
  CONFIRMED:  [
    { label: "Check In",  next: "CHECKED_IN",  icon: <LogIn  size={12} />, color: "btn-luxury-primary text-xs" },
    { label: "Cancel",    next: "CANCELLED",   icon: <XCircle size={12} />, color: "btn-luxury-outline text-xs border-red-700/40 text-red-400 hover:bg-red-900/10" },
  ],
  CHECKED_IN: [{ label: "Check Out", next: "CHECKED_OUT", icon: <LogOut size={12} />, color: "btn-luxury-primary text-xs" }],
  CHECKED_OUT: [],
  CANCELLED:  [],
  NO_SHOW:    [],
  REFUNDED:   [],
};

interface Props {
  bookingId:      string | null;
  onClose:        () => void;
  onStatusUpdate: (id: string, status: string) => void;
}

interface BookingDetail {
  id:             string;
  reference:      string;
  status:         string;
  guestFirstName: string;
  guestLastName:  string;
  guestEmail:     string;
  guestPhone:     string | null;
  specialRequests: string | null;
  arrivalTime:    string | null;
  checkIn:        string;
  checkOut:       string;
  nights:         number;
  adults:         number;
  children:       number;
  subtotal:       number;
  taxAmount:      number;
  totalAmount:    number;
  currency:       string;
  bookingSource:  string;
  createdAt:      string;
  confirmedAt:    string | null;
  checkedInAt:    string | null;
  checkedOutAt:   string | null;
  staffNotes:     string | null;
  items: {
    ratePerNight: number;
    totalRate:    number;
    category:     { name: string; tier: string };
    room:         { number: string; floor: number } | null;
  }[];
  payments: {
    status:     string;
    amount:     number;
    method:     string;
    capturedAt: string | null;
  }[];
  user: { name: string; email: string; loyaltyTier: string; loyaltyPoints: number } | null;
}

export function AdminBookingModal({ bookingId, onClose, onStatusUpdate }: Props) {
  const [booking,    setBooking]    = useState<BookingDetail | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [updating,   setUpdating]   = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [staffNotes, setStaffNotes] = useState("");

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = bookingId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) { setBooking(null); return; }
    setLoading(true);
    setError(null);

    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setBooking(d.data);
          setStaffNotes(d.data.staffNotes ?? "");
        } else setError(d.error ?? "Failed to load");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!booking) return;
    setUpdating(true);
    try {
      const res  = await fetch(`/api/bookings/${booking.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus, staffNotes: staffNotes || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setBooking((b) => b ? { ...b, status: newStatus } : b);
        onStatusUpdate(booking.id, newStatus);
      } else {
        setError(data.error ?? "Update failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setUpdating(false);
    }
  };

  const actions = booking ? (STATUS_ACTIONS[booking.status] ?? []) : [];

  return (
    <AnimatePresence>
      {bookingId && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-obsidian-950 border-l border-obsidian-800 flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            aria-modal="true"
            role="dialog"
            aria-label="Booking detail"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-800 shrink-0">
              <div>
                {booking && (
                  <>
                    <p className="font-body text-xs text-champagne-400 tracking-widest">{booking.reference}</p>
                    <p className="font-display text-xl text-ivory-100">Booking Detail</p>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center border border-obsidian-700 text-obsidian-400 hover:text-ivory-200 hover:border-obsidian-500 transition-all"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
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

              {booking && !loading && (
                <>
                  {/* Status + actions */}
                  <div className="border border-obsidian-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="eyebrow text-2xs text-champagne-600 tracking-widest">Status</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    {actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {actions.map((action) => (
                          <button
                            key={action.next}
                            onClick={() => handleStatusChange(action.next)}
                            disabled={updating}
                            className={cn(
                              "flex items-center gap-1.5 px-4 py-2 transition-all disabled:opacity-50",
                              action.color
                            )}
                          >
                            {updating ? <Loader2 size={11} className="animate-spin" /> : action.icon}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Guest info */}
                  <Section title="Guest">
                    <InfoRow icon={<User size={12} />} label="Name">
                      {booking.guestFirstName} {booking.guestLastName}
                      {booking.user?.loyaltyTier && (
                        <span className="ml-2 eyebrow text-2xs text-champagne-600 border border-champagne-700/30 px-1.5 py-0.5">
                          {booking.user.loyaltyTier}
                        </span>
                      )}
                    </InfoRow>
                    <InfoRow icon={<Mail size={12} />} label="Email">
                      <a href={`mailto:${booking.guestEmail}`} className="text-champagne-400 hover:text-champagne-300 transition-colors">
                        {booking.guestEmail}
                      </a>
                    </InfoRow>
                    {booking.guestPhone && (
                      <InfoRow icon={<Phone size={12} />} label="Phone">{booking.guestPhone}</InfoRow>
                    )}
                    {booking.arrivalTime && (
                      <InfoRow icon={<Clock size={12} />} label="Arrival">{booking.arrivalTime}</InfoRow>
                    )}
                    {booking.user && (
                      <InfoRow icon={<User size={12} />} label="Loyalty">
                        {booking.user.loyaltyPoints.toLocaleString()} points · {booking.user.loyaltyTier}
                      </InfoRow>
                    )}
                  </Section>

                  {/* Stay info */}
                  <Section title="Stay Details">
                    {booking.items[0] && (
                      <InfoRow icon={<BedDouble size={12} />} label="Room">
                        {booking.items[0].category.name}
                        {booking.items[0].room && (
                          <span className="ml-2 text-obsidian-500">Room {booking.items[0].room.number} · Floor {booking.items[0].room.floor}</span>
                        )}
                      </InfoRow>
                    )}
                    <InfoRow icon={<CalendarDays size={12} />} label="Check In">
                      {format(new Date(booking.checkIn), "EEEE, d MMMM yyyy")}
                    </InfoRow>
                    <InfoRow icon={<CalendarDays size={12} />} label="Check Out">
                      {format(new Date(booking.checkOut), "EEEE, d MMMM yyyy")}
                    </InfoRow>
                    <InfoRow icon={<Clock size={12} />} label="Duration">
                      {booking.nights} night{booking.nights > 1 ? "s" : ""} · {booking.adults} adult{booking.adults > 1 ? "s" : ""}
                      {booking.children > 0 ? ` · ${booking.children} children` : ""}
                    </InfoRow>
                    <InfoRow icon={<Clock size={12} />} label="Source">
                      {booking.bookingSource}
                    </InfoRow>
                  </Section>

                  {/* Payment */}
                  <Section title="Payment">
                    <div className="space-y-2">
                      <PriceLine label="Room rate subtotal"         value={formatCurrency(booking.subtotal)} />
                      <PriceLine label="VAT (13%)"                  value={formatCurrency(booking.taxAmount)} muted />
                      <div className="border-t border-obsidian-800 pt-2 flex items-center justify-between">
                        <span className="font-body text-sm text-ivory-200">Total</span>
                        <span className="font-display text-xl text-ivory-100">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                    </div>
                    {booking.payments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-obsidian-800">
                        {booking.payments.map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-xs text-obsidian-400">
                            <span className="flex items-center gap-1.5">
                              <CreditCard size={10} className="text-champagne-700" />
                              {p.method} · {p.status}
                            </span>
                            <span>{formatCurrency(p.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Section>

                  {/* Special requests */}
                  {booking.specialRequests && (
                    <Section title="Special Requests">
                      <div className="flex items-start gap-2 text-sm text-obsidian-300">
                        <MessageSquare size={12} className="text-champagne-700 mt-0.5 shrink-0" />
                        <p className="leading-relaxed">{booking.specialRequests}</p>
                      </div>
                    </Section>
                  )}

                  {/* Staff notes */}
                  <Section title="Staff Notes">
                    <textarea
                      value={staffNotes}
                      onChange={(e) => setStaffNotes(e.target.value)}
                      rows={3}
                      placeholder="Internal notes visible to staff only…"
                      className="w-full bg-obsidian-900/50 border border-obsidian-700 px-3 py-2 text-sm font-body text-ivory-200 placeholder:text-obsidian-600 focus:outline-none focus:border-champagne-700/60 resize-none transition-colors"
                    />
                    <button
                      onClick={() => handleStatusChange(booking.status)}
                      disabled={updating}
                      className="mt-2 text-xs text-champagne-600 hover:text-champagne-400 transition-colors disabled:opacity-50"
                    >
                      {updating ? "Saving…" : "Save notes"}
                    </button>
                  </Section>

                  {/* Timestamps */}
                  <Section title="Timeline">
                    <div className="space-y-2 text-xs text-obsidian-500">
                      <div className="flex justify-between">
                        <span>Created</span>
                        <span>{format(new Date(booking.createdAt), "d MMM yyyy, HH:mm")}</span>
                      </div>
                      {booking.confirmedAt && (
                        <div className="flex justify-between">
                          <span>Confirmed</span>
                          <span>{format(new Date(booking.confirmedAt), "d MMM yyyy, HH:mm")}</span>
                        </div>
                      )}
                      {booking.checkedInAt && (
                        <div className="flex justify-between">
                          <span>Checked In</span>
                          <span>{format(new Date(booking.checkedInAt), "d MMM yyyy, HH:mm")}</span>
                        </div>
                      )}
                      {booking.checkedOutAt && (
                        <div className="flex justify-between">
                          <span>Checked Out</span>
                          <span>{format(new Date(booking.checkedOutAt), "d MMM yyyy, HH:mm")}</span>
                        </div>
                      )}
                    </div>
                  </Section>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-obsidian-800 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-obsidian-800 bg-obsidian-900/30">
        <p className="eyebrow text-2xs text-champagne-600 tracking-widest">{title}</p>
      </div>
      <div className="px-4 py-3 space-y-2.5">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-champagne-700 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="eyebrow text-2xs text-obsidian-600 mb-0.5">{label}</p>
        <p className="font-body text-sm text-ivory-200">{children}</p>
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

function StatusBadge({ status }: { status: string }) {
  const cfg = {
    PENDING:     "text-amber-400 bg-amber-900/20 border-amber-700/30",
    CONFIRMED:   "text-emerald-400 bg-emerald-900/20 border-emerald-700/30",
    CHECKED_IN:  "text-blue-400 bg-blue-900/20 border-blue-700/30",
    CHECKED_OUT: "text-obsidian-400 bg-obsidian-800/40 border-obsidian-700/30",
    CANCELLED:   "text-red-400 bg-red-900/20 border-red-700/30",
    NO_SHOW:     "text-red-400 bg-red-900/20 border-red-700/30",
    REFUNDED:    "text-obsidian-400 bg-obsidian-800/40 border-obsidian-700/30",
  }[status] ?? "text-obsidian-400 border-obsidian-700";

  return (
    <span className={cn("eyebrow text-2xs px-2.5 py-1 border", cfg)}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
