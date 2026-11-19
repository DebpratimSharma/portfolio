"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import ExperienceCard from "@/components/ExperienceCard";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isAtLeft, setIsAtLeft] = useState(false);

  // Pure scroll-triggered bi-directional animation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Scroll threshold with generous hysteresis to prevent any jitter:
      if (rect.top <= windowHeight * 0.55) {
        setIsAtLeft(true);
      } else if (rect.top > windowHeight * 0.68) {
        setIsAtLeft(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prepare timeline entries using the modular ExperienceCard component
  const timelineData: TimelineEntry[] = PORTFOLIO_DATA.experience.map((exp) => ({
    title: exp.timelineDate || exp.period,
    content: <ExperienceCard experience={exp} />,
  }));

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 sm:py-24 bg-black select-none flex flex-col justify-start"
    >
      {/* 
        Scroll-Triggered Animated Heading:
        - Constant Y coordinate below navbar.
        - Smooth horizontal slide along X from center to left margin.
        - Scales down to 0.72 when docked at the left corner.
        - Zero CSS transition conflict for pure hardware-accelerated 60/120 FPS motion.
      */}
      <motion.div
        initial={false}
        animate={{
          top: "clamp(5.5rem, 9vh, 6.5rem)",
          left: isAtLeft ? "clamp(1.5rem, 6vw, 4rem)" : "50%",
          x: isAtLeft ? "0%" : "-50%",
          y: "0%",
          scale: isAtLeft ? 0.72 : 1,
        }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          originX: isAtLeft ? 0 : 0.5,
          originY: 0,
        }}
        className="absolute z-20 pl-1 pointer-events-none flex flex-col w-max items-start text-left"
      >
        <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-500 uppercase">
          03
        </span>
        <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white capitalize drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] whitespace-nowrap">
          experience
        </h2>
      </motion.div>

      {/* 
        Content Container:
        Animates in smoothly AFTER the title has moved to the left side.
        delay of 0.55s ensures title docks first, then the timeline entries glide in.
      */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{
          opacity: isAtLeft ? 1 : 0,
          y: isAtLeft ? 0 : 32,
        }}
        transition={{
          duration: 0.65,
          delay: isAtLeft ? 0.55 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-28 sm:pt-36 md:pt-40 pb-16 flex flex-col",
          isAtLeft ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Top subtle dividing rule */}
        <div className="w-full " />

        {/* Aceternity Timeline Component */}
        <Timeline data={timelineData} animateIn={isAtLeft} />
      </motion.div>
    </section>
  );
}
