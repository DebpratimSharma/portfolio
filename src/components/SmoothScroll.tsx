"use client";

import React, { useEffect, createContext, useContext, useRef } from "react";
import Lenis from "lenis";
import { frame, cancelFrame } from "motion/react";
import "lenis/dist/lenis.css";

interface SmoothScrollContextType {
  getLenis: () => Lenis | null;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: Record<string, unknown>
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  getLenis: () => null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Backward-compatible helper for fixed overlays
 */
export function FixedOverlay({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis with silky smooth physics
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.4, // Silky cinematic smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9, // Balanced scroll velocity to eliminate jitter
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Couple Lenis directly to Motion's internal ticker for zero frame latency
    const update = (data: { timestamp: number; delta: number }) => {
      lenis.raf(data.timestamp);
    };

    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: Record<string, unknown>
  ) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.4,
        ...options,
      });
    } else {
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider
      value={{ getLenis: () => lenisRef.current, scrollTo }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
