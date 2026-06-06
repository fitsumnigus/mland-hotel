"use client";

// src/components/pages/SimplePageClient.tsx
// Reusable luxury layout for secondary/informational pages

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export interface SimplePageSection {
  heading: string;
  body:    string;
  image?:  string;
}

export interface SimpleCTA {
  label: string;
  href:  string;
  variant?: "primary" | "outline";
}

export interface SimplePageProps {
  eyebrow:     string;
  title:       string;
  subtitle:    string;
  heroImage:   string;
  heroAlt:     string;
  sections?:   SimplePageSection[];
  ctas?:       SimpleCTA[];
  backHref?:   string;
  backLabel?:  string;
  children?:   React.ReactNode;
}

export function SimplePageClient({
  eyebrow,
  title,
  subtitle,
  heroImage,
  heroAlt,
  sections = [],
  ctas = [],
  backHref = "/",
  backLabel = "Back",
  children,
}: SimplePageProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(bodyRef, { once: true, amount: 0.1 });

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-obsidian-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/70 via-obsidian-950/20 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="section-container pb-14 lg:pb-20">
            {/* Back nav */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-xs text-ivory-400/60 hover:text-ivory-200 transition-colors font-body tracking-wider group"
              >
                <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                {backLabel}
              </Link>
            </motion.div>

            <motion.p
              className="eyebrow text-xs text-champagne-400 mb-4 tracking-[0.4em]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              className="font-display font-light text-ivory-50 leading-[0.92] mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="font-body text-sm text-ivory-300/70 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            >
              {subtitle}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div ref={bodyRef} className="section-container section-padding">
        {/* Custom children */}
        {children}

        {/* Sections */}
        {sections.length > 0 && (
          <div className="space-y-16 mb-16">
            {sections.map((section, i) => (
              <motion.div
                key={section.heading}
                className={`flex flex-col ${section.image ? "lg:flex-row" : ""} gap-10 items-start`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              >
                <div className={section.image ? "lg:flex-1" : "max-w-2xl"}>
                  <h2 className="font-display text-2xl lg:text-3xl text-ivory-100 font-light mb-4">
                    {section.heading}
                  </h2>
                  <p className="font-body text-sm text-obsidian-300 leading-[1.9]">{section.body}</p>
                </div>
                {section.image && (
                  <div className="relative w-full lg:w-80 xl:w-96 h-56 lg:h-64 shrink-0 overflow-hidden">
                    <Image src={section.image} alt={section.heading} fill className="object-cover" sizes="384px" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* CTAs */}
        {ctas.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          >
            {ctas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={cta.variant === "outline" ? "btn-luxury-outline flex items-center gap-2" : "btn-luxury-primary flex items-center gap-2"}
              >
                {cta.label}
                <ArrowRight size={13} />
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
