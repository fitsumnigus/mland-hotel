"use client";

// src/components/rooms/RoomAmenities.tsx
import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bed, Flame, PenLine, Bath, ShowerHead, Gem, Tv, Wifi, Coffee,
  Sparkles, Bell, Trees, Armchair, Wine, Moon,
  UserCheck, Package, Dumbbell, Mountain, Sofa, Utensils, Crown,
  Paintbrush, Shirt, Sliders, Music, ChefHat, Car, Building,
  DoorOpen, Droplets, Zap, Key, Plane, Activity, Leaf, ThumbsUp,
} from "lucide-react";
import type { RoomData } from "@/lib/data/rooms.data";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// Map icon string keys → Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  "bed-double":    <Bed size={14} />,
  "flame":         <Flame size={14} />,
  "pen-line":      <PenLine size={14} />,
  "bath":          <Bath size={14} />,
  "shower-head":   <ShowerHead size={14} />,
  "gem":           <Gem size={14} />,
  "tv":            <Tv size={14} />,
  "wifi":          <Wifi size={14} />,
  "coffee":        <Coffee size={14} />,
  "sparkles":      <Sparkles size={14} />,
  "concierge-bell":<Bell size={14} />,
  "trees":         <Trees size={14} />,
  "armchair":      <Armchair size={14} />,
  "sink":          <Droplets size={14} />,
  "wine":          <Wine size={14} />,
  "moon":          <Moon size={14} />,
  "user-check":    <UserCheck size={14} />,
  "package":       <Package size={14} />,
  "dumbbell":      <Dumbbell size={14} />,
  "mountain":      <Mountain size={14} />,
  "sofa":          <Sofa size={14} />,
  "utensils":      <Utensils size={14} />,
  "crown":         <Crown size={14} />,
  "paintbrush":    <Paintbrush size={14} />,
  "shirt":         <Shirt size={14} />,
  "sliders":       <Sliders size={14} />,
  "music":         <Music size={14} />,
  "chef-hat":      <ChefHat size={14} />,
  "car":           <Car size={14} />,
  "building":      <Building size={14} />,
  "door-open":     <DoorOpen size={14} />,
  "droplets":      <Droplets size={14} />,
  "zap":           <Zap size={14} />,
  "key":           <Key size={14} />,
  "plane":         <Plane size={14} />,
  "activity":      <Activity size={14} />,
  "leaf":          <Leaf size={14} />,
  "panorama":      <ThumbsUp size={14} />,
};

const CATEGORY_LABELS: Record<string, string> = {
  ROOM:       "Room & Living",
  BATHROOM:   "Bath & Spa",
  TECHNOLOGY: "Technology",
  DINING:     "Food & Drink",
  SERVICE:    "Guest Services",
  WELLNESS:   "Wellness",
};

const CATEGORY_ORDER = ["ROOM", "BATHROOM", "TECHNOLOGY", "DINING", "SERVICE", "WELLNESS"];

interface Props {
  room: RoomData;
}

export function RoomAmenities({ room }: Props) {
  const ref       = useRef<HTMLDivElement>(null);
  const inView    = useInView(ref, { once: true, amount: 0.15 });
  const [expanded, setExpanded] = useState(false);

  // Group amenities by category
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof room.amenities>>((acc, cat) => {
    const items = room.amenities.filter((a) => a.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const categories = Object.keys(grouped);
  const visibleCats = expanded ? categories : categories.slice(0, 4);

  return (
    <div ref={ref} className="mb-14 pb-14 border-b border-obsidian-800/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-8"
      >
        <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.3em]">Amenities & Features</p>
        <h2 className="font-display text-3xl text-ivory-100 font-light">
          Everything Included
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visibleCats.map((cat, ci) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: ci * 0.08, ease: EASE }}
            className="space-y-1"
          >
            <p className="eyebrow text-2xs text-champagne-700 mb-3 tracking-widest">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <div className="space-y-2">
              {grouped[cat].map((amenity) => (
                <div key={amenity.name} className="flex items-center gap-3 py-2 border-b border-obsidian-800/30 last:border-0">
                  <span className="text-champagne-700 shrink-0">
                    {ICON_MAP[amenity.icon] ?? <Sparkles size={14} />}
                  </span>
                  <span className="font-body text-sm text-ivory-300">{amenity.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length > 4 && (
        <motion.button
          className="mt-6 text-xs text-champagne-500 hover:text-champagne-300 transition-colors flex items-center gap-2"
          onClick={() => setExpanded(!expanded)}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <span className={cn("w-4 h-px bg-champagne-600 transition-all", expanded && "w-2")} />
          {expanded ? "Show less" : `Show all ${room.amenities.length} amenities`}
        </motion.button>
      )}
    </div>
  );
}
