"use client";

// src/components/animations/RevealSection.tsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  amount?: number;
}

export function RevealSection({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.7,
  once = true,
  amount = 0.15,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const directionMap = {
    up:    { y: 32, x: 0 },
    down:  { y: -32, x: 0 },
    left:  { x: 48, y: 0 },
    right: { x: -48, y: 0 },
    none:  { x: 0, y: 0 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children reveal
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger child
export const StaggerItem = motion.div;

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
  },
};
<StaggerItem variants={staggerItemVariants} />
// Parallax wrapper
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function Parallax({ children, offset = 40, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      style={{ willChange: "transform" }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}
