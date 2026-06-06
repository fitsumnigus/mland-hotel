"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TESTIMONIALS = [
  {
    id:    "t1",
    name:  "Isabelle Moreau",
    role:  "Paris, France",
    stay:  "Grand Suite · Spring 2024",
    quote: "We've stayed at Claridge's, The Lanesborough, and Ashford Castle. Markland is different — quieter, more genuinely attentive. The kind of place you ring to return before your car has left the driveway.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80",
  },
  {
    id:    "t2",
    name:  "James Thornton",
    role:  "London, United Kingdom",
    stay:  "Wicklow Suite · Autumn 2024",
    quote: "The Grove alone is worth the journey from London. Two Michelin stars that never feel precious — just extraordinarily good food in a room that makes you feel the world has slowed down.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id:    "t3",
    name:  "Mei-Ling Chen",
    role:  "Singapore",
    stay:  "Presidential Suite · Summer 2024",
    quote: "Our honeymoon exceeded every expectation. The welcome — a candlelit room, champagne from our birth year, a card in my husband's handwriting they'd sourced from his assistant — was magic.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  },
  {
    id:    "t4",
    name:  "Dr. Oliver Schäfer",
    role:  "Munich, Germany",
    stay:  "Deluxe Room · Winter 2024",
    quote: "I booked one night. I stayed four. The spa and the landscape conspired. There is something in the silence of the Wicklow hills that the hotel has somehow bottled — or perhaps preserved.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
  {
    id:    "t5",
    name:  "Valentina Rossi",
    role:  "Milan, Italy",
    stay:  "Junior Suite · Spring 2024",
    quote: "The afternoon tea, taken on the terrace as the mist rolled across the valley, with a fire lit inside and a glass of something exceptional — I have thought of it every day since returning home.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
];

const PRESS = [
  { name: "Condé Nast Traveller", quote: "One of Europe's great hidden hotels" },
  { name: "The Times",            quote: "Sublime in every particular" },
  { name: "Tatler",               quote: "The new benchmark for Irish luxury" },
  { name: "Forbes Travel",        quote: "Five stars without question" },
  { name: "Harper's Bazaar",      quote: "Quietly perfect" },
];

export function TestimonialsSection() {
  const sectionRef              = useRef<HTMLElement>(null);
  const inView                  = useInView(sectionRef, { once: true, amount: 0.1 });
  const [active, setActive]     = useState(0);
  const [dir,    setDir]        = useState(1);
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback((direction: number) => {
    setDir(direction);
    setActive((c) => (c + direction + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => advance(1), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  const handleNav = (d: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    advance(d);
    timerRef.current = setInterval(() => advance(1), 6000);
  };

  const slideVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.35, ease: EASE } }),
  };

  const t = TESTIMONIALS[active];

  return (
    <section ref={sectionRef} className="relative bg-obsidian-950 overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-champagne-700/25 to-transparent" />

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(212,160,50,0.03) 0%, transparent 70%)" }}
      />

      <div className="section-container section-padding">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Guest Voices</p>
          <h2 className="font-display text-display-sm lg:text-display-md text-ivory-100 font-light leading-[0.95]">
            What Our Guests Say
          </h2>
        </motion.div>

        {/* Testimonial carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={t.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div className="flex flex-col items-center text-center px-4 lg:px-16">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-champagne-400 fill-champagne-400" />
                    ))}
                  </div>

                  {/* Quote mark */}
                  <Quote size={28} className="text-champagne-800/60 mb-5 -scale-x-100" />

                  {/* Quote text */}
                  <blockquote className="font-display text-xl lg:text-2xl text-ivory-200 leading-relaxed font-light mb-8 italic">
                    "{t.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-champagne-700/30 mb-2">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-body text-sm font-medium text-ivory-300">{t.name}</p>
                    <p className="text-2xs text-obsidian-500">{t.role}</p>
                    <span className="eyebrow text-2xs text-champagne-600 mt-1 border border-champagne-700/30 px-2.5 py-0.5">{t.stay}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => handleNav(-1)}
              className="w-9 h-9 border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-champagne-600 hover:text-champagne-400 transition-all"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
                  className={cn(
                    "transition-all duration-300",
                    i === active
                      ? "w-6 h-1 bg-champagne-500"
                      : "w-1 h-1 rounded-full bg-obsidian-700 hover:bg-obsidian-500"
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => handleNav(1)}
              className="w-9 h-9 border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-champagne-600 hover:text-champagne-400 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Press quotes marquee */}
        <motion.div
          className="mt-20 pt-12 border-t border-obsidian-800/60"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="eyebrow text-2xs text-obsidian-600 text-center mb-8 tracking-widest">As Seen In</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {PRESS.map((p) => (
              <div key={p.name} className="text-center group cursor-default">
                <p className="font-display text-base text-obsidian-500 group-hover:text-obsidian-300 transition-colors duration-300">{p.name}</p>
                <p className="text-2xs text-obsidian-700 mt-1 group-hover:text-champagne-600 transition-colors italic">"{p.quote}"</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
