"use client";

// src/components/booking/BookingStepSelect.tsx
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Maximize2, Users, BedDouble, CheckCircle2,
  Loader2, AlertCircle, ArrowRight, Check,
} from "lucide-react";
import { ROOM_CATALOG } from "@/lib/data/rooms.data";
import { useAvailability } from "@/hooks/useAvailability";
import type { BookingState } from "@/components/booking/BookingEngine";
import { formatCurrency, cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TIER_ORDER = ["DELUXE","SUPERIOR","JUNIOR_SUITE","SUITE","GRAND_SUITE","PRESIDENTIAL"];

interface Props {
  state:  BookingState;
  update: (patch: Partial<BookingState>) => void;
  onNext: () => void;
}

export function BookingStepSelect({ state, update, onNext }: Props) {
  const nights = Math.max(0, differenceInDays(
    new Date(state.checkOut + "T12:00"),
    new Date(state.checkIn  + "T12:00")
  ));

  const { results, isLoading, error } = useAvailability({
    checkIn:  state.checkIn,
    checkOut: state.checkOut,
    adults:   state.adults,
    children: state.children,
    enabled:  nights > 0,
  });

  // Merge static catalog with live availability results
  // Filter catalog by guest capacity, sort by tier
  const eligibleRooms = ROOM_CATALOG
    .filter((r) => r.maxOccupancy >= state.adults + state.children)
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  const getRoomResult = (roomId: string, roomName: string) =>
    results.find((r) => r.categoryId === roomId || r.categoryName === roomName);

  const handleSelect = (room: typeof ROOM_CATALOG[0]) => {
    update({ selectedRoom: room });
    onNext();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-8"
      >
        <p className="eyebrow text-xs text-champagne-500 mb-2 tracking-[0.3em]">Step 2</p>
        <h2 className="font-display text-3xl lg:text-4xl text-ivory-100 font-light mb-2">
          Choose Your Room
        </h2>
        <p className="font-body text-sm text-obsidian-400">
          {nights} night{nights !== 1 ? "s" : ""} · {format(new Date(state.checkIn + "T12:00"), "d MMM")} – {format(new Date(state.checkOut + "T12:00"), "d MMM yyyy")} · {state.adults + state.children} guest{state.adults + state.children > 1 ? "s" : ""}
        </p>
      </motion.div>

      {/* Availability status banner */}
      {isLoading && (
        <motion.div
          className="flex items-center gap-3 border border-obsidian-700 px-4 py-3 mb-6 text-sm text-obsidian-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 size={14} className="animate-spin text-champagne-600 shrink-0" />
          Checking live availability for your dates…
        </motion.div>
      )}
      {error && (
        <div className="flex items-center gap-3 border border-amber-800/40 bg-amber-900/10 px-4 py-3 mb-6 text-sm text-amber-400">
          <AlertCircle size={14} className="shrink-0" />
          Unable to check live availability — showing estimated rates. Confirm at checkout.
        </div>
      )}

      {/* Room list */}
      <div className="space-y-4">
        {eligibleRooms.map((room, i) => {
          const result      = getRoomResult(room.id, room.name);
          const isAvailable = result ? result.available : !isLoading; // optimistic when no DB
          const rate        = result?.ratePerNight ?? room.baseRateWeekday;
          const totalRate   = result?.totalRate ?? (rate * nights);
          const isSelected  = state.selectedRoom?.id === room.id;

          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              className={cn(
                "border transition-all duration-300 overflow-hidden",
                isSelected
                  ? "border-champagne-500 bg-champagne-900/8"
                  : isAvailable
                  ? "border-obsidian-700 hover:border-obsidian-500 bg-obsidian-900/40"
                  : "border-obsidian-800 bg-obsidian-900/20 opacity-60"
              )}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={room.heroImage}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 176px"
                    quality={80}
                  />
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-obsidian-950/60 flex items-center justify-center">
                      <span className="eyebrow text-2xs text-ivory-400 bg-obsidian-900/80 px-2 py-1">Unavailable</span>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-champagne-500 flex items-center justify-center">
                      <Check size={12} className="text-obsidian-950" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 lg:p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="eyebrow text-2xs text-champagne-600 tracking-widest block mb-1">{room.tierLabel}</span>
                      <h3 className="font-display text-xl text-ivory-100 leading-tight">{room.name}</h3>
                    </div>
                    {/* Availability pill */}
                    {!isLoading && result && (
                      <div className={cn(
                        "flex items-center gap-1.5 eyebrow text-2xs px-2 py-1 border shrink-0",
                        result.available
                          ? "border-emerald-700/40 text-emerald-400 bg-emerald-900/10"
                          : "border-red-700/40 text-red-400 bg-red-900/10"
                      )}>
                        {result.available ? <CheckCircle2 size={9} /> : <AlertCircle size={9} />}
                        {result.available ? `${result.availableCount} available` : "Full"}
                      </div>
                    )}
                  </div>

                  <p className="font-body text-xs text-obsidian-400 mb-3 leading-relaxed line-clamp-2">
                    {room.shortDesc}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-4">
                    <RoomMeta icon={<Maximize2 size={10} />} label={`${room.sizeM2} m²`} />
                    <RoomMeta icon={<Users size={10} />}     label={`Up to ${room.maxOccupancy}`} />
                    <RoomMeta icon={<BedDouble size={10} />} label={room.features[0]} />
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.features.slice(0, 3).map((f) => (
                      <span key={f} className="eyebrow text-2xs border border-obsidian-700/50 text-obsidian-500 px-2 py-0.5">{f}</span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-obsidian-800/50">
                    <div>
                      <p className="eyebrow text-2xs text-obsidian-600">
                        {formatCurrency(rate)} × {nights} night{nights > 1 ? "s" : ""}
                      </p>
                      <p className="font-display text-2xl text-ivory-100 leading-none mt-0.5">
                        {formatCurrency(totalRate)}
                      </p>
                      <p className="text-2xs text-obsidian-500 mt-0.5">excl. 13% VAT</p>
                    </div>
                    <button
                      onClick={() => isAvailable && handleSelect(room)}
                      disabled={!isAvailable}
                      className={cn(
                        "flex items-center gap-2 transition-all duration-200",
                        isSelected
                          ? "btn-luxury-primary py-2.5 px-5 text-2xs"
                          : isAvailable
                          ? "btn-luxury-outline py-2.5 px-5 text-2xs hover:btn-luxury-primary"
                          : "py-2.5 px-5 text-2xs border border-obsidian-700 text-obsidian-600 cursor-not-allowed"
                      )}
                    >
                      {isSelected ? (
                        <><Check size={12} /> Selected</>
                      ) : isAvailable ? (
                        <>Select <ArrowRight size={12} /></>
                      ) : (
                        "Unavailable"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function RoomMeta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-2xs text-obsidian-400">
      <span className="text-champagne-700">{icon}</span>
      {label}
    </span>
  );
}
