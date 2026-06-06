"use client";

// src/components/pages/LegalPageClient.tsx
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Section {
  heading: string;
  body:    string;
}

interface Props {
  title:       string;
  lastUpdated: string;
  sections:    Section[];
}

export function LegalPageClient({ title, lastUpdated, sections }: Props) {
  return (
    <div className="min-h-screen bg-obsidian-950 pt-32 pb-24">
      <div className="section-container max-w-3xl">
        {/* Back */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-obsidian-500 hover:text-ivory-300 transition-colors group font-body tracking-wider"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Legal</p>
          <h1 className="font-display text-display-sm text-ivory-100 font-light leading-tight mb-3">
            {title}
          </h1>
          <p className="font-body text-xs text-obsidian-500 tracking-wider">
            Last updated: {lastUpdated}
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-champagne-700/30 to-transparent" />
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * i, ease: EASE }}
            >
              <h2 className="font-display text-xl text-ivory-200 font-light mb-3">
                {section.heading}
              </h2>
              <p className="font-body text-sm text-obsidian-400 leading-[1.85]">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer nav */}
        <motion.div
          className="mt-16 pt-8 border-t border-obsidian-800 flex flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/privacy-policy"      className="text-xs text-obsidian-500 hover:text-champagne-400 transition-colors font-body">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="text-xs text-obsidian-500 hover:text-champagne-400 transition-colors font-body">Terms & Conditions</Link>
          <Link href="/cookie-policy"       className="text-xs text-obsidian-500 hover:text-champagne-400 transition-colors font-body">Cookie Policy</Link>
        </motion.div>
      </div>
    </div>
  );
}
