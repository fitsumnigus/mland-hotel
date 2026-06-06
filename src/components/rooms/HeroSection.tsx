"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id:      "sanctuary",
    headline: ["Where Silence", "Becomes Luxury"],
    sub:     "Nestled in 300 acres of private County Wicklow woodland",
    tag:     "The Estate",
    img:     "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=90",
    cta:     { label: "Explore Rooms", href: "/rooms" },
  },
  {
    id:      "wellness",
    headline: ["Awaken Every", "Sense"],
    sub:     "Award-winning spa crafted for total restoration",
    tag:     "Spa & Wellness",
    img:     "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=1920&q=90",
    cta:     { label: "Discover Spa", href: "/spa" },
  },
  {
    id:      "dining",
    headline: ["A Table Unlike", "Any Other"],
    sub:     "Two Michelin-starred dining in a setting of timeless beauty",
    tag:     "Fine Dining",
    img:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90",
    cta:     { label: "View Dining", href: "/dining" },
  },
];

const ORBS = [
  [
    { cx: "15%", cy: "30%", r: "28vw", col: "rgba(212,160,50,0.07)" },
    { cx: "80%", cy: "70%", r: "20vw", col: "rgba(212,160,50,0.04)" },
  ],
  [
    { cx: "70%", cy: "20%", r: "24vw", col: "rgba(184,196,160,0.06)" },
    { cx: "20%", cy: "75%", r: "18vw", col: "rgba(184,196,160,0.04)" },
  ],
  [
    { cx: "85%", cy: "50%", r: "30vw", col: "rgba(196,150,122,0.06)" },
    { cx: "10%", cy: "60%", r: "22vw", col: "rgba(196,150,122,0.04)" },
  ],
];

const EASE_LUXURY = [0.25, 0.46, 0.45, 0.94] as const;

export function HeroSection() {
  const [current,   setCurrent]   = useState(0);
  const [textReady, setTextReady] = useState(false);
  const [muted,     setMuted]     = useState(true);
  const [progress,  setProgress]  = useState(0);
  const [mounted,   setMounted]   = useState(false);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mouseX   = useMotionValue(0);
  const mouseY   = useMotionValue(0);
  const springX  = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY  = useSpring(mouseY, { damping: 25, stiffness: 150 });
  const ambientX = useTransform(springX, [0, 1440], [-10, 10]);
  const ambientY = useTransform(springY, [0, 900],  [-6, 6]);

  useEffect(() => { setMounted(true); }, []);

  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const DURATION = 7000;
    const TICK = 50;
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
    }, TICK);
  }, []);

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    startProgress();
  }, [startProgress]);

  useEffect(() => {
    startProgress();
    timerRef.current = setInterval(advance, 7000);
    return () => {
      if (timerRef.current)   clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [advance, startProgress]);

  useEffect(() => {
    setTextReady(false);
    const t = setTimeout(() => setTextReady(true), 200);
    return () => clearTimeout(t);
  }, [current]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  const goTo = (idx: number) => {
    if (idx === current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(idx);
    startProgress();
    timerRef.current = setInterval(advance, 7000);
  };

  const slide = SLIDES[current];
  const orbs  = ORBS[current];

  const wordVariants = {
    hidden:  { y: "110%", opacity: 0 },
    visible: (i: number) => ({
      y: 0, opacity: 1,
      transition: { delay: 0.06 * i, duration: 0.9, ease: EASE_LUXURY },
    }),
    exit: { y: "-60%", opacity: 0, transition: { duration: 0.35, ease: EASE_LUXURY } },
  };

  if (!mounted) return (
    <div className="relative h-screen min-h-[640px] bg-obsidian-950 flex items-end">
      <div className="section-container pb-24 lg:pb-32">
        <div className="h-2 w-32 bg-obsidian-800 rounded mb-6 animate-pulse" />
        <div className="h-20 w-96 bg-obsidian-800 rounded mb-4 animate-pulse" />
        <div className="h-4 w-64 bg-obsidian-800 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <section
      className="relative h-screen min-h-[640px] overflow-hidden bg-obsidian-950 select-none"
      onMouseMove={handleMouseMove}
    >
      {/* Background images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${slide.id}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1,  scale: 1.0  }}
          exit={{   opacity: 0                }}
          transition={{ duration: 1.6, ease: EASE_LUXURY }}
        >
          <Image
            src={slide.img}
            alt={slide.headline.join(" ")}
            fill priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/25 to-obsidian-950/10 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/85 via-obsidian-950/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/40 via-transparent to-transparent z-10" />
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(13,11,10,0.55) 100%)" }}
      />

      {/* Ambient orbs — cursor reactive */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ x: ambientX, y: ambientY }}>
        <AnimatePresence>
          {orbs.map((orb, i) => (
            <motion.div
              key={`${slide.id}-orb-${i}`}
              className="absolute rounded-full blur-3xl"
              style={{
                left:      orb.cx,
                top:       orb.cy,
                width:     orb.r,
                height:    orb.r,
                background: orb.col,
                transform: "translate(-50%,-50%)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1   }}
              exit={{    opacity: 0, scale: 0.8  }}
              transition={{ duration: 2.2, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Film grain */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Main content */}
      <div className="relative z-30 h-full flex flex-col justify-end">
        <div className="section-container pb-20 lg:pb-32">
          {/* Eyebrow tag */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${slide.id}`}
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1,  x: 0   }}
              exit={{   opacity: 0           }}
              transition={{ duration: 0.6, ease: EASE_LUXURY }}
            >
              <motion.span
                className="h-px bg-gradient-to-r from-champagne-500 to-champagne-600/40"
                initial={{ width: 0 }}
                animate={{ width: 44 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              />
              <span className="eyebrow text-2xs text-champagne-400 tracking-[0.38em]">{slide.tag}</span>
            </motion.div>
          </AnimatePresence>

          {/* Headline word-by-word */}
          <AnimatePresence mode="wait">
            {textReady && (
              <motion.h1
                key={`h1-${slide.id}`}
                className="font-display font-light text-ivory-50 leading-[0.9] mb-7"
                style={{ fontSize: "clamp(2.8rem, 7.5vw, 8rem)", perspective: "900px" }}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {slide.headline.map((line, li) => (
                  <div key={li} className="block overflow-hidden">
                    <div className="flex flex-wrap gap-x-[0.22em]">
                      {line.split(" ").map((word, wi) => (
                        <motion.span
                          key={`${li}-${wi}`}
                          className="inline-block"
                          custom={li * 3 + wi}
                          variants={wordVariants}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.h1>
            )}
          </AnimatePresence>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${slide.id}`}
              className="font-body text-sm lg:text-[0.95rem] text-ivory-300/70 mb-10 max-w-sm lg:max-w-md tracking-wide leading-relaxed"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1,  y: 0  }}
              exit={{   opacity: 0,  y: -8  }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE_LUXURY }}
            >
              {slide.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`ctas-${slide.id}`}
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1,  y: 0  }}
              exit={{   opacity: 0         }}
              transition={{ duration: 0.6, delay: 0.55, ease: EASE_LUXURY }}
            >
              <Link href={slide.cta.href} className="btn-luxury-primary">
                {slide.cta.label}
              </Link>
              <Link href="/book" className="btn-luxury-outline">
                Reserve a Room
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right rail — progress dots */}
      <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={`cnt-${current}`}
            className="font-display text-xl text-champagne-500/50 leading-none mb-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1,  y: 0  }}
            exit={{   opacity: 0,  y: 8   }}
            transition={{ duration: 0.35 }}
          >
            0{current + 1}
          </motion.span>
        </AnimatePresence>

        <div className="flex flex-col gap-2.5">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} className="relative flex justify-center items-center">
              <span className={cn(
                "block w-px transition-all duration-500",
                i === current ? "h-14 bg-obsidian-700" : "h-5 bg-obsidian-700/40 hover:bg-obsidian-600"
              )} />
              {i === current && (
                <motion.span
                  className="absolute top-0 left-0 w-px bg-champagne-400 origin-top"
                  style={{ height: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
        <span className="font-body text-2xs text-obsidian-600 mt-1">/ 0{SLIDES.length}</span>
      </div>

      {/* Sound toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute left-6 lg:left-12 bottom-10 z-30 flex items-center gap-2 text-obsidian-500 hover:text-champagne-400 transition-colors"
      >
        {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        <span className="eyebrow text-2xs">{muted ? "Sound Off" : "Sound On"}</span>
      </button>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={15} className="text-champagne-700/50" />
      </motion.div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 inset-x-0 h-px z-30 bg-gradient-to-r from-transparent via-champagne-700/35 to-transparent" />
    </section>
  );
}
