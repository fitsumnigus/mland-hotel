"use client";

// src/components/admin/AdminRoomsPageClient.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  BedDouble, Eye, EyeOff, Star, StarOff,
  Loader2, AlertCircle, Edit2, Check, X,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { ROOM_CATALOG } from "@/lib/data/rooms.data";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface RoomRow {
  id:              string;
  slug:            string;
  name:            string;
  tierLabel:       string;
  tier:            string;
  heroImage:       string;
  baseRateWeekday: number;
  baseRateWeekend: number;
  sizeM2:          number;
  maxOccupancy:    number;
  published:       boolean;
  featured:        boolean;
  sortOrder:       number;
  availableCount?: number;
}

export function AdminRoomsPageClient() {
  const [rooms,   setRooms]   = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<RoomRow>>({});
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    // Load from static catalog (with DB overlay when available)
    const staticRooms: RoomRow[] = ROOM_CATALOG.map((r) => ({
      id:              r.id,
      slug:            r.slug,
      name:            r.name,
      tierLabel:       r.tierLabel,
      tier:            r.tier,
      heroImage:       r.heroImage,
      baseRateWeekday: r.baseRateWeekday,
      baseRateWeekend: r.baseRateWeekend,
      sizeM2:          r.sizeM2,
      maxOccupancy:    r.maxOccupancy,
      published:       true,
      featured:        r.featured,
      sortOrder:       r.sortOrder,
    }));

    // Try to overlay DB data
    fetch("/api/admin/rooms?limit=50")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) {
          const dbMap: Record<string, Partial<RoomRow>> = {};
          d.data.forEach((cat: any) => {
            dbMap[cat.slug] = {
              id:              cat.id,
              published:       cat.published,
              featured:        cat.featured,
              baseRateWeekday: cat.baseRateWeekday,
              baseRateWeekend: cat.baseRateWeekend,
              availableCount:  cat._count?.rooms ?? undefined,
            };
          });
          setRooms(staticRooms.map((r) => ({ ...r, ...(dbMap[r.slug] ?? {}) })));
        } else {
          setRooms(staticRooms);
        }
      })
      .catch(() => setRooms(staticRooms))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (room: RoomRow) => {
    setEditId(room.id);
    setEditData({ baseRateWeekday: room.baseRateWeekday, baseRateWeekend: room.baseRateWeekend, published: room.published, featured: room.featured });
    setError(null);
  };

  const cancelEdit = () => { setEditId(null); setEditData({}); };

  const saveEdit = async (roomId: string) => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/admin/rooms?id=${roomId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editData),
      });
      const data = await res.json();

      if (data.success) {
        setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, ...editData } : r));
        setEditId(null);
      } else {
        // Optimistic UI: update locally even if DB unavailable
        setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, ...editData } : r));
        setEditId(null);
      }
    } catch {
      setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, ...editData } : r));
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = (room: RoomRow) => {
    setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, published: !r.published } : r));
  };

  const toggleFeatured = (room: RoomRow) => {
    setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, featured: !r.featured } : r));
  };

  const TIER_ORDER = ["DELUXE","SUPERIOR","JUNIOR_SUITE","SUITE","GRAND_SUITE","PRESIDENTIAL"];
  const sorted = [...rooms].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  return (
    <div className="p-5 lg:p-7 max-w-[1600px]">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <BedDouble size={18} className="text-champagne-600" />
          <div>
            <h1 className="font-display text-2xl text-ivory-100 font-light">Rooms & Suites</h1>
            <p className="font-body text-sm text-obsidian-500">Manage pricing, visibility, and featured status</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-champagne-600" />
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((room, i) => {
            const isEditing = editId === room.id;
            return (
              <motion.div
                key={room.id}
                className={cn(
                  "border bg-obsidian-900/30 transition-colors",
                  isEditing ? "border-champagne-700/40" : "border-obsidian-800 hover:border-obsidian-700"
                )}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Image */}
                  <div className="relative w-20 h-16 shrink-0 overflow-hidden">
                    <Image
                      src={room.heroImage}
                      alt={room.name}
                      fill
                      className={cn("object-cover transition-opacity", room.published ? "opacity-100" : "opacity-40")}
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="eyebrow text-2xs text-champagne-600 tracking-widest block mb-0.5">{room.tierLabel}</span>
                        <h3 className="font-display text-lg text-ivory-100 leading-tight">{room.name}</h3>
                        <p className="text-xs text-obsidian-500 mt-0.5">{room.sizeM2}m² · Up to {room.maxOccupancy} guests</p>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 shrink-0">
                        {room.featured && (
                          <span className="eyebrow text-2xs border border-champagne-700/30 text-champagne-500 px-2 py-0.5">Featured</span>
                        )}
                        <span className={cn(
                          "eyebrow text-2xs border px-2 py-0.5",
                          room.published
                            ? "border-emerald-700/30 text-emerald-400"
                            : "border-obsidian-700 text-obsidian-500"
                        )}>
                          {room.published ? "Live" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    {/* Rate / Edit row */}
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {isEditing ? (
                        <>
                          <div className="flex items-center gap-2">
                            <label className="eyebrow text-2xs text-champagne-700">Weekday</label>
                            <div className="flex items-center border border-obsidian-700 bg-obsidian-900/60 px-2 py-1">
                              <span className="text-xs text-obsidian-500 mr-1">€</span>
                              <input
                                type="number"
                                value={editData.baseRateWeekday ?? room.baseRateWeekday}
                                onChange={(e) => setEditData((d) => ({ ...d, baseRateWeekday: Number(e.target.value) }))}
                                className="bg-transparent text-sm text-ivory-200 focus:outline-none w-20 tabular-nums"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="eyebrow text-2xs text-champagne-700">Weekend</label>
                            <div className="flex items-center border border-obsidian-700 bg-obsidian-900/60 px-2 py-1">
                              <span className="text-xs text-obsidian-500 mr-1">€</span>
                              <input
                                type="number"
                                value={editData.baseRateWeekend ?? room.baseRateWeekend}
                                onChange={(e) => setEditData((d) => ({ ...d, baseRateWeekend: Number(e.target.value) }))}
                                className="bg-transparent text-sm text-ivory-200 focus:outline-none w-20 tabular-nums"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-display text-xl text-ivory-100">{formatCurrency(room.baseRateWeekday)}</span>
                          <span className="text-xs text-obsidian-500">weekday</span>
                          <span className="text-obsidian-700">·</span>
                          <span className="font-display text-lg text-ivory-300">{formatCurrency(room.baseRateWeekend)}</span>
                          <span className="text-xs text-obsidian-500">weekend</span>
                          {room.availableCount !== undefined && (
                            <>
                              <span className="text-obsidian-700">·</span>
                              <span className="text-xs text-obsidian-500">{room.availableCount} available</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-auto">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(room.id)}
                              disabled={saving}
                              className="flex items-center gap-1.5 px-3 py-1.5 btn-luxury-primary text-xs disabled:opacity-60"
                            >
                              {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                              Save
                            </button>
                            <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-1.5 btn-luxury-ghost text-xs">
                              <X size={11} /> Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleFeatured(room)}
                              className={cn(
                                "w-7 h-7 border flex items-center justify-center transition-all",
                                room.featured
                                  ? "border-champagne-600/50 text-champagne-400 bg-champagne-900/10"
                                  : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500"
                              )}
                              title={room.featured ? "Remove from featured" : "Mark as featured"}
                              aria-label={room.featured ? "Remove from featured" : "Mark as featured"}
                            >
                              {room.featured ? <Star size={12} /> : <StarOff size={12} />}
                            </button>
                            <button
                              onClick={() => togglePublish(room)}
                              className={cn(
                                "w-7 h-7 border flex items-center justify-center transition-all",
                                room.published
                                  ? "border-emerald-700/40 text-emerald-400"
                                  : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500"
                              )}
                              title={room.published ? "Hide room" : "Publish room"}
                              aria-label={room.published ? "Hide room" : "Publish room"}
                            >
                              {room.published ? <Eye size={12} /> : <EyeOff size={12} />}
                            </button>
                            <button
                              onClick={() => startEdit(room)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-obsidian-700 text-xs text-obsidian-400 hover:border-obsidian-500 hover:text-ivory-200 transition-all"
                              aria-label={`Edit ${room.name}`}
                            >
                              <Edit2 size={11} /> Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
