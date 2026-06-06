"use client";

// src/components/admin/AdminGuestsPageClient.tsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, ChevronLeft, ChevronRight,
  Loader2, Mail, Phone, Star, Eye,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, cn } from "@/lib/utils";
import { AdminGuestModal } from "@/components/admin/AdminGuestModal";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const LOYALTY_COLORS: Record<string, string> = {
  CLASSIC:  "text-obsidian-400 border-obsidian-600",
  SILVER:   "text-slate-300 border-slate-600",
  GOLD:     "text-amber-300 border-amber-600/50",
  PLATINUM: "text-cyan-300 border-cyan-600/50",
};

interface Guest {
  id:            string;
  email:         string;
  firstName:     string | null;
  lastName:      string | null;
  name:          string | null;
  phone:         string | null;
  nationality:   string | null;
  loyaltyTier:   string;
  loyaltyPoints: number;
  createdAt:     string;
  _count:        { bookings: number };
  bookings:      {
    id:          string;
    reference:   string;
    status:      string;
    createdAt:   string;
    totalAmount: number;
  }[];
}

export function AdminGuestsPageClient() {
  const [guests,     setGuests]     = useState<Guest[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [debSearch,  setDebSearch]  = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (debSearch) params.set("search", debSearch);
      const res  = await fetch(`/api/admin/guests?${params}`);
      const data = await res.json();
      if (data.success) {
        setGuests(data.data ?? []);
        setTotal(data.meta?.total ?? 0);
        setTotalPages(data.meta?.totalPages ?? 1);
      }
    } catch { /* swallow */ }
    finally { setLoading(false); }
  }, [page, debSearch]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  return (
    <div className="p-5 lg:p-7 max-w-[1600px]">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <Users size={18} className="text-champagne-600" />
          <div>
            <h1 className="font-display text-2xl text-ivory-100 font-light">Guests</h1>
            <p className="font-body text-sm text-obsidian-500">{total} registered guests</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
      >
        <div className="flex items-center gap-2 border border-obsidian-700 bg-obsidian-900/40 px-4 py-2.5 max-w-sm focus-within:border-champagne-700/50 transition-colors">
          <Search size={13} className="text-obsidian-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="bg-transparent font-body text-sm text-ivory-200 placeholder:text-obsidian-600 focus:outline-none flex-1"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="border border-obsidian-800 bg-obsidian-900/30"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body min-w-[640px]">
            <thead>
              <tr className="border-b border-obsidian-800">
                {["Guest", "Contact", "Loyalty", "Bookings", "Last Stay", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left eyebrow text-2xs text-obsidian-600 tracking-widest font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 size={20} className="animate-spin text-champagne-600 mx-auto" />
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-obsidian-500 font-body text-sm">
                    No guests found
                  </td>
                </tr>
              ) : guests.map((guest, i) => (
                <motion.tr
                  key={guest.id}
                  className="border-b border-obsidian-800/40 hover:bg-obsidian-800/20 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.025 }}
                  onClick={() => setSelectedId(guest.id)}
                >
                  <td className="px-4 py-3">
                    <p className="text-ivory-300 font-medium">
                      {guest.firstName} {guest.lastName}
                    </p>
                    <p className="text-xs text-obsidian-500">{guest.nationality ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-obsidian-400">
                        <Mail size={10} className="text-champagne-800" />
                        <span className="truncate max-w-[200px]">{guest.email}</span>
                      </span>
                      {guest.phone && (
                        <span className="flex items-center gap-1.5 text-xs text-obsidian-500">
                          <Phone size={10} className="text-champagne-800" />
                          {guest.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={cn(
                        "eyebrow text-2xs border px-2 py-0.5 self-start",
                        LOYALTY_COLORS[guest.loyaltyTier] ?? "text-obsidian-400 border-obsidian-700"
                      )}>
                        {guest.loyaltyTier}
                      </span>
                      <span className="text-xs text-obsidian-500">
                        {guest.loyaltyPoints.toLocaleString()} pts
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-display text-xl text-ivory-200">{guest._count.bookings}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-obsidian-400">
                    {guest.bookings[0]
                      ? format(new Date(guest.bookings[0].createdAt), "d MMM yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedId(guest.id); }}
                      className="text-obsidian-500 hover:text-champagne-400 transition-colors p-1"
                      aria-label="View guest profile"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-obsidian-800 flex items-center justify-between">
            <span className="text-2xs text-obsidian-600">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="w-7 h-7 border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="w-7 h-7 border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-champagne-600 hover:text-champagne-400 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AdminGuestModal guestId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
