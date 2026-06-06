// src/hooks/useGSAP.ts
"use client";
import { useEffect, useRef } from "react";

// Simple no-arg callback version used by components that inline dynamic imports
type SimpleCallback = () => void | (() => void);

export function useGSAP(callback: SimpleCallback, deps: unknown[] = []) {
  const cleanupRef = useRef<ReturnType<SimpleCallback> | undefined>(undefined);

  useEffect(() => {
    const result = callback();
    if (typeof result === "function") {
      cleanupRef.current = result;
    }
    return () => {
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
      }
    };
    // deps are passed by caller; intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  speed = 0.3
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let ticking = false;
    let raf = 0;

    const onScroll = () => {
      if (!ticking) {
        raf = requestAnimationFrame(() => {
          if (!el) return;
          const rect   = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2 - window.innerHeight / 2;
          el.style.transform = `translateY(${center * speed}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, speed]);
}
