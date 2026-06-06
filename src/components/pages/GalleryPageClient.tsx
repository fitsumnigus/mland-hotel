"use client";

// src/components/pages/GalleryPageClient.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const CATEGORIES = ["All", "Rooms & Suites", "Spa", "Dining", "Estate", "Events"] as const;
type Category = typeof CATEGORIES[number];

interface Photo {
  id:  string;
  src: string;
  alt: string;
  cat: Exclude<Category, "All">;
  wide?: boolean;
}

const PHOTOS: Photo[] = [
  { id: "r1",  src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85", alt: "Garden Room — king bedroom",          cat: "Rooms & Suites", wide: true },
  { id: "r2",  src: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85", alt: "Wicklow Suite — terrace",             cat: "Rooms & Suites" },
  { id: "r3",  src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85", alt: "Markland Grand — master bedroom",      cat: "Rooms & Suites" },
  { id: "r4",  src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85", alt: "Garden Room — marble bathroom",        cat: "Rooms & Suites" },
  { id: "r5",  src: "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=1200&q=85", alt: "Presidential Suite — living room",     cat: "Rooms & Suites", wide: true },
  { id: "s1",  src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=85", alt: "Spa — thermal pool",                  cat: "Spa", wide: true },
  { id: "s2",  src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=85", alt: "Spa — treatment room",                cat: "Spa" },
  { id: "s3",  src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=85", alt: "Spa — relaxation suite",              cat: "Spa" },
  { id: "s4",  src: "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=1200&q=85", alt: "Spa — steam room",                    cat: "Spa" },
  { id: "d1",  src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85", alt: "The Grove — dining room",             cat: "Dining", wide: true },
  { id: "d2",  src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85", alt: "The Cellars — candlelit interior",    cat: "Dining" },
  { id: "d3",  src: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1200&q=85", alt: "The Grove — tasting menu course",     cat: "Dining" },
  { id: "d4",  src: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=85", alt: "Garden Terrace — summer dining",      cat: "Dining" },
  { id: "e1",  src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85", alt: "Estate — entrance at dusk",           cat: "Estate", wide: true },
  { id: "e2",  src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85", alt: "Estate — Wicklow landscape",          cat: "Estate" },
  { id: "e3",  src: "https://images.unsplash.com/photo-1465310477141-6fb93167a273?w=1200&q=85", alt: "Estate — morning parkland",           cat: "Estate" },
  { id: "ev1", src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85", alt: "Events — grand ballroom",             cat: "Events", wide: true },
  { id: "ev2", src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85", alt: "Events — wedding ceremony",           cat: "Events" },
];

export function GalleryPageClient() {
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inView   = useInView(bodyRef, { once: true, amount: 0.05 });
  const [cat,     setCat]     = useState<Category>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);

  const filtered = cat === "All" ? PHOTOS : PHOTOS.filter((p) => p.cat === cat);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + filtered.length) % filtered.length);
  }, [lightbox, filtered.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % filtered.length);
  }, [lightbox, filtered.length]);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next, close]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div className="bg-obsidian-950 min-h-screen pt-32 pb-24">
      <div className="section-container">
        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Photography</p>
          <h1 className="font-display text-display-sm lg:text-display-md text-ivory-100 font-light leading-[0.95] mb-4">
            Gallery
          </h1>
          <p className="font-body text-sm text-obsidian-400 max-w-lg">
            A visual portrait of Markland Hotel & Spa — the rooms, the spa, the dining, and the estate.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-obsidian-800 pb-5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-4 py-1.5 font-body text-xs tracking-wider transition-all",
                cat === c
                  ? "bg-champagne-500 text-obsidian-950"
                  : "border border-obsidian-700 text-obsidian-400 hover:border-obsidian-500 hover:text-ivory-200"
              )}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto text-2xs text-obsidian-600 self-center">{filtered.length} photos</span>
        </div>

        {/* Masonry-style grid */}
        <div ref={bodyRef}>
          <AnimatePresence mode="popLayout">
            <motion.div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3" layout>
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  className={cn("relative overflow-hidden cursor-zoom-in break-inside-avoid mb-3 group", photo.wide ? "sm:col-span-2" : "")}
                  style={{ height: photo.wide ? "320px" : "240px" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4), ease: EASE }}
                  layout
                  onMouseEnter={() => setHovered(photo.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setLightbox(i)}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: hovered === photo.id ? 1.05 : 1 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" quality={80} />
                  </motion.div>
                  <AnimatePresence>
                    {hovered === photo.id && (
                      <motion.div
                        className="absolute inset-0 bg-obsidian-950/40 flex flex-col items-center justify-center gap-2"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ZoomIn size={20} className="text-ivory-200" />
                        <span className="eyebrow text-2xs text-ivory-300">{photo.cat}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
        >
          <p className="font-body text-sm text-obsidian-500 mb-4">Ready to experience it in person?</p>
          <Link href="/book" className="btn-luxury-primary">Reserve Your Stay</Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-obsidian-950/96 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            role="dialog" aria-modal="true" aria-label="Photo viewer"
          >
            <button className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center border border-obsidian-700 text-ivory-400 hover:text-ivory-100 hover:border-obsidian-500 transition-all" onClick={close} aria-label="Close gallery">
              <X size={16} />
            </button>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
              <span className="eyebrow text-2xs text-obsidian-400">{lightbox + 1} / {filtered.length}</span>
            </div>
            <button className="absolute left-4 lg:left-8 z-10 w-10 h-10 flex items-center justify-center border border-obsidian-700 text-ivory-400 hover:text-champagne-400 hover:border-champagne-700 transition-all" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image">
              <ChevronLeft size={18} />
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={lightbox}
                className="relative max-w-5xl w-full max-h-[88vh] mx-16"
                style={{ height: "88vh" }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={filtered[lightbox].src} alt={filtered[lightbox].alt} fill className="object-contain" sizes="100vw" quality={95} priority />
              </motion.div>
            </AnimatePresence>
            <button className="absolute right-4 lg:right-8 z-10 w-10 h-10 flex items-center justify-center border border-obsidian-700 text-ivory-400 hover:text-champagne-400 hover:border-champagne-700 transition-all" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image">
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-2xl overflow-x-auto px-4">
              {filtered.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  title={`View image ${i + 1}`}
                  aria-label={`View image ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={cn("relative flex-shrink-0 w-12 h-9 overflow-hidden border-2 transition-all", i === lightbox ? "border-champagne-500 opacity-100" : "border-transparent opacity-40 hover:opacity-70")}
                >
                  <Image src={p.src} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
