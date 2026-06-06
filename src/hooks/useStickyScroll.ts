// src/hooks/useStickyScroll.ts
"use client";

import { useState, useEffect, useRef, RefObject } from "react";

interface UseStickyOptions {
  topOffset?:    number;   // px from top to activate sticky
  bottomBound?:  RefObject<HTMLElement | null>; // element that stops sticky
}

export function useStickyScroll({
  topOffset   = 88,
  bottomBound,
}: UseStickyOptions = {}) {
  const [isSticky, setIsSticky] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > topOffset);

      if (bottomBound?.current) {
        const boundRect     = bottomBound.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        setIsAtBottom(boundRect.bottom < viewportHeight + 200);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [topOffset, bottomBound]);

  return { isSticky, isAtBottom };
}

// ─── Intersection observer hook ───────────────────────────────────────

export function useIsInView(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = {}
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// ─── Lock scroll ──────────────────────────────────────────────────────

export function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (locked) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [locked]);
}
