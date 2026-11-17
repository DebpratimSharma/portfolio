"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";

interface HoverTextAnimateProps {
  children: string;
  className?: string;
  animation?:
    | "fadeIn"
    | "blurIn"
    | "blurInUp"
    | "blurInDown"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleUp"
    | "scaleDown";
  by?: "character" | "word" | "text" | "line";
  duration?: number;
  as?: "article" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "li" | "p" | "section" | "span";
}

/**
 * Re-triggers TextAnimate on mouse hover — ideal for buttons and anchor tags.
 */
export function HoverTextAnimate({
  children,
  className,
  animation = "blurInUp",
  by = "character",
  duration = 0.3,
  as = "span",
}: HoverTextAnimateProps) {
  const [hoverKey, setHoverKey] = useState(0);

  return (
    <span
      className={cn("inline-block", className)}
      onMouseEnter={() => setHoverKey((prev) => prev + 1)}
    >
      <TextAnimate
        key={hoverKey}
        animation={animation}
        by={by}
        duration={duration}
        as={as}
        startOnView={false}
      >
        {children}
      </TextAnimate>
    </span>
  );
}

interface StaggerRollingTextProps {
  children: string;
  className?: string;
  duration?: number;
  stagger?: number;
}

/**
 * Classic portfolio hover effect for links & buttons:
 * Staggers characters sliding up while revealing a duplicate line from underneath.
 */
export function StaggerRollingText({
  children,
  className,
  duration = 0.28,
  stagger = 0.02,
}: StaggerRollingTextProps) {
  return (
    <motion.span
      className={cn("relative inline-flex overflow-hidden leading-tight", className)}
      initial="initial"
      whileHover="hover"
    >
      <span className="inline-flex">
        {children.split("").map((char, i) => (
          <motion.span
            key={`top-${i}`}
            className="inline-block"
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%" },
            }}
            transition={{
              duration,
              delay: i * stagger,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0 inline-flex" aria-hidden="true">
        {children.split("").map((char, i) => (
          <motion.span
            key={`bot-${i}`}
            className="inline-block"
            variants={{
              initial: { y: "100%" },
              hover: { y: 0 },
            }}
            transition={{
              duration,
              delay: i * stagger,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}

export default HoverTextAnimate;
