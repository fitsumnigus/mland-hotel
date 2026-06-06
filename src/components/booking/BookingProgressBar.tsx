"use client";

// src/components/booking/BookingProgressBar.tsx
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { BookingStep } from "@/components/booking/BookingEngine";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: BookingStep;
  steps:       BookingStep[];
  labels:      Record<BookingStep, string>;
}

export function BookingProgressBar({ currentStep, steps, labels }: Props) {
  const currentIdx = steps.indexOf(currentStep);
  // Exclude confirmation from progress display
  const displaySteps = steps.filter((s) => s !== "confirmation");

  return (
    <div className="flex items-center gap-0">
      {displaySteps.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isActive    = step === currentStep;
        const isLast      = i === displaySteps.length - 1;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              {/* Circle */}
              <div className={cn(
                "relative w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-400",
                isCompleted ? "bg-champagne-500 border-champagne-500" :
                isActive    ? "border-champagne-500 bg-transparent" :
                              "border-obsidian-600 bg-transparent"
              )}>
                {isCompleted ? (
                  <Check size={10} className="text-obsidian-950" />
                ) : (
                  <span className={cn(
                    "text-2xs font-body tabular-nums",
                    isActive ? "text-champagne-400" : "text-obsidian-600"
                  )}>
                    {i + 1}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-champagne-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Label */}
              <span className={cn(
                "eyebrow text-2xs tracking-wider transition-colors hidden sm:block",
                isActive ? "text-champagne-400" :
                isCompleted ? "text-obsidian-400" :
                              "text-obsidian-600"
              )}>
                {labels[step]}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex-1 mx-2 h-px bg-obsidian-800 max-w-16 relative overflow-hidden">
                {isCompleted && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-champagne-600"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
