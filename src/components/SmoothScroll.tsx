"use client";

import React, { useEffect, createContext, useContext, useRef } from "react";
import { usePathname } from "next/navigation";
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
  scrollTo: (target) => {
    if (typeof window !== "undefined") {
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  },
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
  const pathname = usePathname();

  useEffect(() => {
    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Disable Lenis on touch devices to enable native 120Hz iOS compositor momentum scrolling
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Initialize Lenis with silky smooth physics for desktop pointer devices
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

    // Initial hash scroll handling if landed with a hash
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -40,
            duration: 1.2,
          });
        }
      }, 350);
    }

    const handleHashChange = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const targetEl = document.querySelector(window.location.hash);
        if (targetEl) {
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -40,
            duration: 1.2,
          });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to top on route change if no hash is present
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: Record<string, unknown>
  ) => {
    const lenis = lenisRef.current;
    const resolvedTarget =
      typeof target === "string"
        ? (document.querySelector(target) as HTMLElement | null) ?? target
        : target;

    if (lenis) {
      lenis.scrollTo(resolvedTarget, {
        duration: 1.4,
        ...options,
      });
    } else {
      if (typeof resolvedTarget === "number") {
        window.scrollTo({ top: resolvedTarget, behavior: "smooth" });
      } else {
        const el =
          typeof resolvedTarget === "string"
            ? document.querySelector(resolvedTarget)
            : resolvedTarget;
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
