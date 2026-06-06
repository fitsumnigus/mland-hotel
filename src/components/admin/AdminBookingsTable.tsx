"use client";

// src/components/admin/AdminBookingsTable.tsx
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, CheckCircle2, XCircle, Clock, AlertCircle,
  ChevronLeft, ChevronRight, Eye, MoreHorizontal, Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, cn } from "@/lib/utils";
import { AdminBookingModal } from "@/components/admin/AdminBookingModal";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:      { label: "Pending",     color: "text-amber-400 bg-amber-900/20 border-amber-700/30", icon: <Clock size={10} /> },
  CONFIRMED:    { label: "Confirmed",   color: "text-emerald-400 bg-emerald-900/20 border-emerald-700/30", icon: <CheckCircle2 size={10} /> },
  CHECKED_IN:   { label: "Checked In",  color: "text-blue-400 bg-blue-900/20 border-blue-700/30", icon: <CheckCircle2 size={10} /> },
  CHECKED_OUT:  { label: "Checked Out", color: "text-obsidian-400 bg-obsidian-800/40 border-obsidian-700/30", icon: <CheckCircle2 size={10} /> },
  CANCELLED:    { label: "Cancelled",   color: "text-red-400 bg-red-900/20 border-red-700/30", icon: <XCircle size={10} /> },
  NO_SHOW:      { label: "No Show",     color: "text-red-400 bg-red-900/20 border-red-700/30", icon: <AlertCircle size={10} /> },
  REFUNDED:     { label: "Refunded",    color: "text-obsidian-400 bg-obsidian-800/40 border-obsidian-700/30", icon: <XCircle size={10} /> },
};

interface Booking {
  id:             string;
  reference:      string;
  status:         string;
  guestFirstName: string;
  guestLastName:  string;
  guestEmail:     string;
  checkIn:        string;
  checkOut:       string;
  nights:         number;
  adults:         number;
  totalAmount:    number;
  createdAt:      string;
  items:          { category: { name: string; tier: string } }[];
  payments:       { status: string; amount: number }[];
}

interface Props {
  limit?: number;
  showFilters?: boolean;
}

export function AdminBookingsTable({ limit = 20, showFilters = false }: Props) {
  const [bookings,     setBookings]     = useState<Booking[]>([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(limit),
        ...(statusFilter && { status: statusFilter }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const res  = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();

      if (data.success) {
        setBookings(data.data ?? []);
        setTotal(data.meta?.total ?? 0);
        setTotalPages(data.meta?.totalPages ?? 1);
      }
    } catch {
      /* swallow */
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, debouncedSearch]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b)
    );
  };

  return (
    <>
      {/* Filters */}
      {showFilters && (
        <div className="px-5 py-3 border-b border-obsidian-800 flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-obsidian-700 bg-obsidian-900/40 px-3 py-2 flex-1 min-w-[200px] max-w-xs focus-within:border-champagne-700/50 transition-colors">
            <Search size={13} className="text-obsidian-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Reference, name or email…"
              className="bg-transparent font-body text-sm text-ivory-200 placeholder:text-obsidian-600 focus:outline-none flex-1"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-obsidian-700 bg-obsidian-900/40 px-3 py-2 text-sm font-body text-ivory-200 focus:outline-none focus:border-champagne-700/50 [&>option]:bg-obsidian-900 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
              <option key={val} value={val}>{cfg.label}</option>
            ))}
          </select>

          <span className="flex items-center text-2xs text-obsidian-600 tracking-wider ml-auto">
            {total} booking{total !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body min-w-[700px]">
          <thead>
            <tr className="border-b border-obsidian-800">
              {["Reference", "Guest", "Room", "Dates", "Amount", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left eyebrow text-2xs text-obsidian-600 tracking-widest font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center">
                  <Loader2 size={20} className="animate-spin text-champagne-600 mx-auto" />
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-obsidian-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking, i) => {
                const sc = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <motion.tr
                    key={booking.id}
                    className="border-b border-obsidian-800/40 hover:bg-obsidian-800/20 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    onClick={() => setSelectedId(booking.id)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-body text-xs text-champagne-400 tracking-wider">
                        {booking.reference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ivory-300">{booking.guestFirstName} {booking.guestLastName}</p>
                      <p className="text-xs text-obsidian-500 truncate max-w-[180px]">{booking.guestEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ivory-400 text-xs">{booking.items[0]?.category?.name ?? "—"}</p>
                      <p className="text-obsidian-600 text-2xs">{booking.nights}N · {booking.adults} guest{booking.adults > 1 ? "s" : ""}</p>
                    </td>
                    <td className="px-4 py-3 text-obsidian-400 text-xs whitespace-nowrap">
                      {format(new Date(booking.checkIn), "d MMM")} → {format(new Date(booking.checkOut), "d MMM yy")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-display text-base text-ivory-200">{formatCurrency(booking.totalAmount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 eyebrow text-2xs px-2 py-1 border",
                        sc.color
                      )}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(booking.id); }}
                        className="text-obsidian-500 hover:text-champagne-400 transition-colors p-1"
                        aria-label="View booking details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-obsidian-800 flex items-center justify-between">
          <span className="text-2xs text-obsidian-600">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-7 h-7 border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-30 transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-7 h-7 border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-30 transition-all"
              aria-label="Next page"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AdminBookingModal
        bookingId={selectedId}
        onClose={() => setSelectedId(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}
