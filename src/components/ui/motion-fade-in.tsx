"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

interface MotionFadeInProps extends Omit<HTMLMotionProps<"div">, "whileInView"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  whileInView?: boolean;
  viewportMargin?: string;
  className?: string;
}

export function MotionFadeIn({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 24,
  whileInView = false,
  viewportMargin = "-80px",
  className,
  ...props
}: MotionFadeInProps) {
  const transition = {
    duration,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  if (whileInView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: yOffset }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: viewportMargin }}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
