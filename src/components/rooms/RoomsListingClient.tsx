"use client";

// src/components/rooms/RoomsListingClient.tsx
import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Users, Maximize2 } from "lucide-react";
import type { RoomData } from "@/lib/data/rooms.data";
import { RoomCard } from "@/components/rooms/RoomCard";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Filter types ─────────────────────────────────────────────────────

type TierFilter     = "ALL" | RoomData["tier"];
type SortOption     = "recommended" | "price-asc" | "price-desc" | "size-asc";
type GuestFilter    = 1 | 2 | 3 | 4 | 6 | 10;

const TIERS: { value: TierFilter; label: string }[] = [
  { value: "ALL",           label: "All Rooms" },
  { value: "DELUXE",        label: "Deluxe" },
  { value: "SUPERIOR",      label: "Superior" },
  { value: "JUNIOR_SUITE",  label: "Junior Suite" },
  { value: "SUITE",         label: "Suite" },
  { value: "GRAND_SUITE",   label: "Grand Suite" },
  { value: "PRESIDENTIAL",  label: "Presidential" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc",   label: "Price: Low to High" },
  { value: "price-desc",  label: "Price: High to Low" },
  { value: "size-asc",    label: "Room Size" },
];

const MAX_PRICE_OPTIONS = [500, 750, 1000, 1500, 2500, 9999];

interface Props {
  rooms: RoomData[];
}

export function RoomsListingClient({ rooms }: Props) {
  const heroRef   = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const [tier,      setTier]      = useState<TierFilter>("ALL");
  const [sort,      setSort]      = useState<SortOption>("recommended");
  const [maxPrice,  setMaxPrice]  = useState<number>(9999);
  const [minGuests, setMinGuests] = useState<number>(1);
  const [sortOpen,  setSortOpen]  = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Filtered + sorted rooms ──────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = rooms.filter((r) => {
      if (tier !== "ALL" && r.tier !== tier) return false;
      if (r.baseRateWeekday > maxPrice) return false;
      if (r.maxOccupancy < minGuests) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":   list = [...list].sort((a, b) => a.baseRateWeekday - b.baseRateWeekday); break;
      case "price-desc":  list = [...list].sort((a, b) => b.baseRateWeekday - a.baseRateWeekday); break;
      case "size-asc":    list = [...list].sort((a, b) => b.sizeM2 - a.sizeM2); break;
      default:            list = [...list].sort((a, b) => a.sortOrder - b.sortOrder); break;
    }
    return list;
  }, [rooms, tier, sort, maxPrice, minGuests]);

  const activeFilterCount = [
    tier !== "ALL",
    maxPrice !== 9999,
    minGuests > 1,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setTier("ALL");
    setMaxPrice(9999);
    setMinGuests(1);
  };

  return (
    <div className="min-h-screen bg-obsidian-950">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,160,50,0.05) 0%, transparent 70%)" }} />

        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-2xs text-obsidian-600 tracking-widest font-body uppercase">Markland</span>
              <span className="text-obsidian-700">·</span>
              <span className="text-2xs text-champagne-600 tracking-widest font-body uppercase">Rooms & Suites</span>
            </div>

            <p className="eyebrow text-xs text-champagne-500 mb-5 tracking-[0.35em]">Accommodations</p>
            <h1 className="font-display text-display-md lg:text-display-lg text-ivory-100 font-light leading-[0.92] mb-6">
              Rooms &<br />
              <em className="text-gradient-gold not-italic">Suites</em>
            </h1>
            <span className="gold-line mb-6" />
            <p className="font-body text-sm text-obsidian-400 max-w-lg leading-relaxed">
              48 individually designed rooms and suites across six distinct tiers. Every space is a study in Irish craft, considered luxury, and the quiet drama of the Wicklow landscape.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Sticky filter bar ─────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-40 bg-obsidian-950/95 backdrop-blur-md border-y border-obsidian-800/60">
        <div className="section-container">
          <div className="flex items-center gap-0 py-0 overflow-x-auto scrollbar-hide">
            {/* Tier tabs */}
            <div className="flex items-center gap-0 flex-shrink-0 border-r border-obsidian-800/60 pr-4 mr-4">
              {TIERS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTier(t.value)}
                  className={cn(
                    "relative px-4 py-4 font-body text-xs tracking-wider whitespace-nowrap transition-colors duration-200",
                    tier === t.value
                      ? "text-champagne-400"
                      : "text-obsidian-500 hover:text-obsidian-300"
                  )}
                >
                  {t.label}
                  {tier === t.value && (
                    <motion.span
                      layoutId="tier-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-champagne-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3 ml-auto flex-shrink-0 py-2">
              {/* Filter toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-body tracking-wider border transition-all",
                  filtersOpen || activeFilterCount > 0
                    ? "border-champagne-600/50 text-champagne-400 bg-champagne-900/10"
                    : "border-obsidian-700 text-obsidian-400 hover:border-obsidian-600 hover:text-obsidian-200"
                )}
              >
                <SlidersHorizontal size={12} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-champagne-500 text-obsidian-950 text-2xs flex items-center justify-center font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-body tracking-wider border border-obsidian-700 text-obsidian-400 hover:border-obsidian-600 hover:text-obsidian-200 transition-all"
                >
                  {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                  <ChevronDown size={11} className={cn("transition-transform", sortOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 w-48 bg-obsidian-900 border border-obsidian-700 shadow-luxury-lg z-50 py-1"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-xs font-body tracking-wider transition-colors",
                            sort === opt.value
                              ? "text-champagne-400 bg-obsidian-800"
                              : "text-obsidian-400 hover:text-obsidian-200 hover:bg-obsidian-800/50"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Results count */}
              <span className="text-2xs text-obsidian-600 tracking-wider pl-2 border-l border-obsidian-800">
                {filtered.length} {filtered.length === 1 ? "room" : "rooms"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Expanded filter panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="border-b border-obsidian-800/60 bg-obsidian-950"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div className="section-container py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Max nightly rate */}
                <div>
                  <p className="eyebrow text-2xs text-champagne-600 mb-3">Max Nightly Rate</p>
                  <div className="flex flex-wrap gap-2">
                    {MAX_PRICE_OPTIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setMaxPrice(p)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-body border transition-all",
                          maxPrice === p
                            ? "border-champagne-500 text-champagne-400 bg-champagne-900/10"
                            : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500"
                        )}
                      >
                        {p === 9999 ? "Any" : `€${p.toLocaleString()}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min guests */}
                <div>
                  <p className="eyebrow text-2xs text-champagne-600 mb-3">Minimum Capacity</p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 6].map((g) => (
                      <button
                        key={g}
                        onClick={() => setMinGuests(g)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border transition-all",
                          minGuests === g
                            ? "border-champagne-500 text-champagne-400 bg-champagne-900/10"
                            : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500"
                        )}
                      >
                        <Users size={10} /> {g}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                {activeFilterCount > 0 && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-xs text-champagne-600 hover:text-champagne-400 transition-colors"
                    >
                      <X size={11} /> Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Room grid ─────────────────────────────────────────────────── */}
      <div ref={gridRef} className="section-container py-16 lg:py-20">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center py-32 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-display text-2xl text-ivory-400 mb-3">No rooms match your filters</p>
              <p className="font-body text-sm text-obsidian-500 mb-6">Try adjusting your criteria to see more options</p>
              <button onClick={clearFilters} className="btn-luxury-outline text-xs">Clear Filters</button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              layout
            >
              {filtered.map((room, i) => (
                <motion.div
                  key={room.id}
                  layout
                  initial={{ opacity: 0, y: 32, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <div className="border-t border-obsidian-800/60">
        <div className="section-container py-16 text-center">
          <p className="font-display text-xl text-ivory-400 mb-2">Can't find what you're looking for?</p>
          <p className="font-body text-sm text-obsidian-500 mb-6">Our reservations team will find the perfect space for your stay.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+35312345678" className="btn-luxury-outline text-xs">Call Reservations</a>
            <a href="mailto:reservations@marklandhotel.com" className="btn-luxury-ghost text-xs">Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
