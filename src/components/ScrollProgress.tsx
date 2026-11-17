"use client";

import React from "react";
import { motion, useScroll, useSpring } from "motion/react";

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className = "" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  // Smooth spring physics for fluid progress feedback
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none bg-white/10"
    >
      <motion.div
        style={{ scaleX }}
        className={`h-full w-full origin-left bg-white ${className}`}
      />
    </div>
  );
}
