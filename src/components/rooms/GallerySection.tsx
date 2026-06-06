"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ZoomIn } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const GALLERY = [
  {
    id:   "g1",
    src:  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85",
    alt:  "Estate entrance at dusk",
    cat:  "The Estate",
    span: "col-span-2 row-span-2",
  },
  {
    id:   "g2",
    src:  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    alt:  "Deluxe room fireplace",
    cat:  "Rooms",
    span: "col-span-1 row-span-1",
  },
  {
    id:   "g3",
    src:  "https://images.unsplash.com/photo-1537539108542-d944e5e547a8?w=800&q=80",
    alt:  "Spa thermal pool",
    cat:  "Spa",
    span: "col-span-1 row-span-1",
  },
  {
    id:   "g4",
    src:  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80",
    alt:  "The Grove fine dining",
    cat:  "Dining",
    span: "col-span-1 row-span-1",
  },
  {
    id:   "g5",
    src:  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
    alt:  "Grand suite bathroom",
    cat:  "Rooms",
    span: "col-span-1 row-span-1",
  },
  {
    id:   "g6",
    src:  "https://images.unsplash.com/photo-1465310477141-6fb93167a273?w=1200&q=85",
    alt:  "Estate grounds at sunrise",
    cat:  "The Estate",
    span: "col-span-2 row-span-1",
  },
];

export function GallerySection() {
  const sectionRef             = useRef<HTMLElement>(null);
  const inView                 = useInView(sectionRef, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<typeof GALLERY[0] | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);

  return (
    <section ref={sectionRef} className="relative bg-obsidian-950">
      {/* Thin gold separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-champagne-700/30 to-transparent" />

      <div className="section-container section-padding">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div>
            <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Gallery</p>
            <h2 className="font-display text-display-sm lg:text-display-md text-ivory-100 font-light leading-[0.95]">
              The Estate<br />in <em className="text-gradient-gold not-italic">Detail</em>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 btn-luxury-ghost text-champagne-500 hover:text-champagne-300 self-start lg:self-auto"
          >
            Full gallery <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* Masonry grid — desktop */}
        <div className="hidden md:grid grid-cols-4 grid-rows-3 gap-3" style={{ height: "640px" }}>
          {GALLERY.map((item, i) => (
            <motion.div
              key={item.id}
              className={`relative overflow-hidden cursor-zoom-in ${item.span}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setLightbox(item)}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: hovered === item.id ? 1.06 : 1 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 50vw, 25vw"
                  quality={85}
                />
              </motion.div>
              {/* Hover overlay */}
              <AnimatePresence>
                {hovered === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-obsidian-950/40 flex flex-col items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{   opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ZoomIn size={20} className="text-ivory-200" />
                    <span className="eyebrow text-2xs text-ivory-300 tracking-widest">{item.cat}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Bottom gradient label on big items */}
              {item.span.includes("row-span-2") && (
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-obsidian-950/70 to-transparent flex items-end p-4">
                  <span className="eyebrow text-2xs text-champagne-400 tracking-widest">{item.cat}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll strip */}
        <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6">
          {GALLERY.map((item, i) => (
            <motion.div
              key={item.id}
              className="relative flex-shrink-0 w-72 h-56 snap-center overflow-hidden rounded-sm"
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onClick={() => setLightbox(item)}
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="288px" />
              <div className="absolute bottom-3 left-3">
                <span className="eyebrow text-2xs text-champagne-400 bg-obsidian-900/70 px-2 py-0.5">{item.cat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] bg-obsidian-950/95 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] rounded-sm overflow-hidden"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{   scale: 0.96,  opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[80vh]">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={95}
                />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-obsidian-950/80 to-transparent p-6">
                <span className="eyebrow text-2xs text-champagne-400 tracking-widest">{lightbox.cat}</span>
                <p className="font-body text-sm text-ivory-300 mt-1">{lightbox.alt}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-obsidian-900/80 border border-obsidian-700 flex items-center justify-center text-ivory-400 hover:text-ivory-100 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
