"use client";

// src/components/rooms/RoomGallery.tsx
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid3x3, Expand } from "lucide-react";
import type { RoomData } from "@/lib/data/rooms.data";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Props {
  room: RoomData;
}

export function RoomGallery({ room }: Props) {
  const images = room.galleryImages;
  const [lightbox,    setLightbox]    = useState<number | null>(null);
  const [gridExpanded, setGridExpanded] = useState(false);
  const [loaded,      setLoaded]      = useState<Record<number, boolean>>({});

  const open  = (i: number) => setLightbox(i);
  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + images.length) % images.length);
  }, [lightbox, images.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % images.length);
  }, [lightbox, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const displayImages = gridExpanded ? images : images.slice(0, 5);

  return (
    <div className="mb-16">
      {/* Section label */}
      <div className="flex items-center justify-between mb-5">
        <p className="eyebrow text-xs text-champagne-500 tracking-[0.3em]">Gallery</p>
        <button
          onClick={() => setGridExpanded(!gridExpanded)}
          className="flex items-center gap-2 text-xs text-obsidian-400 hover:text-champagne-400 transition-colors"
        >
          <Grid3x3 size={12} />
          {gridExpanded ? "Show Less" : `View All ${images.length}`}
        </button>
      </div>

      {/* Primary image + mosaic */}
      <div className="grid grid-cols-4 gap-2">
        {/* Main large image */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative cursor-zoom-in overflow-hidden group"
          style={{ height: "380px" }}
          onClick={() => open(0)}
        >
          <Image
            src={images[0]}
            alt={`${room.name} — main view`}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
            onLoad={() => setLoaded((p) => ({ ...p, 0: true }))}
          />
          <div className="absolute inset-0 bg-obsidian-950/0 group-hover:bg-obsidian-950/20 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              className="w-10 h-10 rounded-full bg-obsidian-950/60 border border-ivory-300/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <Expand size={14} className="text-ivory-300" />
            </motion.div>
          </div>
        </div>

        {/* Secondary grid */}
        {images.slice(1, 5).map((src, idx) => {
          const i = idx + 1;
          const isLast = i === 4 && images.length > 5 && !gridExpanded;
          return (
            <div
              key={i}
              className="col-span-2 md:col-span-1 relative cursor-zoom-in overflow-hidden group"
              style={{ height: "186px" }}
              onClick={() => open(i)}
            >
              <Image
                src={src}
                alt={`${room.name} — view ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="25vw"
                quality={80}
              />
              {/* More overlay */}
              {isLast && (
                <div className="absolute inset-0 bg-obsidian-950/70 flex flex-col items-center justify-center">
                  <p className="font-display text-2xl text-ivory-100">+{images.length - 5}</p>
                  <p className="eyebrow text-2xs text-ivory-400">more photos</p>
                </div>
              )}
              <div className="absolute inset-0 bg-obsidian-950/0 group-hover:bg-obsidian-950/15 transition-colors duration-300" />
            </div>
          );
        })}
      </div>

      {/* Expanded grid */}
      <AnimatePresence>
        {gridExpanded && images.length > 5 && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {images.slice(5).map((src, idx) => {
              const i = idx + 5;
              return (
                <div
                  key={i}
                  className="relative cursor-zoom-in overflow-hidden group"
                  style={{ height: "186px" }}
                  onClick={() => open(i)}
                >
                  <Image
                    src={src}
                    alt={`${room.name} — view ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="25vw"
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-obsidian-950/0 group-hover:bg-obsidian-950/20 transition-colors" />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-obsidian-950/97 backdrop-blur-lg flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo gallery — image ${lightbox + 1} of ${images.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center border border-obsidian-700 text-ivory-400 hover:text-ivory-100 hover:border-obsidian-500 transition-all"
              onClick={close}
              aria-label="Close gallery"
            >
              <X size={16} />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
              <span className="eyebrow text-2xs text-obsidian-400">
                {lightbox + 1} / {images.length}
              </span>
            </div>

            {/* Prev */}
            <button
              className="absolute left-4 lg:left-8 z-10 w-10 h-10 flex items-center justify-center border border-obsidian-700 text-ivory-400 hover:text-champagne-400 hover:border-champagne-700 transition-all"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Main image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightbox}
                className="relative max-w-6xl w-full max-h-[88vh] mx-16"
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97, x: -20 }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                style={{ height: "88vh" }}
              >
                <Image
                  src={images[lightbox]}
                  alt={`${room.name} — photo ${lightbox + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={95}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Next */}
            <button
              className="absolute right-4 lg:right-8 z-10 w-10 h-10 flex items-center justify-center border border-obsidian-700 text-ivory-400 hover:text-champagne-400 hover:border-champagne-700 transition-all"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-2xl overflow-x-auto px-4">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={cn(
                    "relative flex-shrink-0 w-14 h-10 overflow-hidden border-2 transition-all",
                    i === lightbox
                      ? "border-champagne-500 opacity-100"
                      : "border-transparent opacity-40 hover:opacity-70"
                  )}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
