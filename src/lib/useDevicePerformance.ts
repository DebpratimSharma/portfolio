"use client";

import { useState, useEffect, useCallback } from "react";

export interface DevicePerformance {
  /** True on touch-only / mobile devices */
  isMobile: boolean;
  /** True when user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** True on low-end devices (low RAM, low core count, slow connection, or low GPU) */
  isLowEnd: boolean;
  /** Device pixel ratio (clamped to 2 max for perf) */
  dpr: number;
  /** True when heavy animations should be completely skipped */
  shouldReduceAnimations: boolean;
  /** True when GPU-heavy effects (Three.js, canvas) should be skipped */
  shouldSkipGPUEffects: boolean;
}

/**
 * Central hook for device capability detection.
 * Returns flags that components use to decide which animations / effects to render.
 *
 * Detection heuristics:
 *  - `navigator.hardwareConcurrency` ≤ 4  → low-end
 *  - `(navigator as any).deviceMemory` ≤ 4 → low-end
 *  - `(navigator as any).connection?.effectiveType` is 'slow-2g' | '2g' | '3g' → low-end
 *  - `pointer: coarse` + viewport ≤ 768 → mobile
 *  - `prefers-reduced-motion: reduce` → respect OS pref
 */
export function useDevicePerformance(): DevicePerformance {
  const [perf, setPerf] = useState<DevicePerformance>({
    isMobile: false,
    prefersReducedMotion: false,
    isLowEnd: false,
    dpr: 1,
    shouldReduceAnimations: false,
    shouldSkipGPUEffects: false,
  });

  useEffect(() => {
    const detect = () => {
      // --- Mobile detection ---
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const noFine = !window.matchMedia("(pointer: fine)").matches;
      const smallViewport = window.innerWidth <= 768;
      const isMobile = (isCoarse || noFine) && smallViewport;

      // --- Reduced motion ---
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // --- Low-end heuristics ---
      const nav = navigator as any;
      const cores = navigator.hardwareConcurrency || 8;
      const memory = nav.deviceMemory ?? 8; // GB, undefined on Firefox/Safari
      const connection = nav.connection;
      const effectiveType = connection?.effectiveType ?? "4g";
      const slowConnection = ["slow-2g", "2g", "3g"].includes(effectiveType);

      const isLowEnd =
        cores <= 4 || memory <= 4 || slowConnection || (isCoarse && smallViewport);

      // --- DPR ---
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // --- Derived flags ---
      const shouldReduceAnimations =
        prefersReducedMotion || isLowEnd || isMobile;
      const shouldSkipGPUEffects =
        prefersReducedMotion || (isLowEnd && isMobile);

      setPerf({
        isMobile,
        prefersReducedMotion,
        isLowEnd,
        dpr,
        shouldReduceAnimations,
        shouldSkipGPUEffects,
      });
    };

    detect();

    // Re-check on resize (tablet rotation, etc.)
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  return perf;
}
