"use client";

import React from "react";
import { motion } from "motion/react";
import ScrollReveal from "@/components/ScrollReveal";
import GradientASCII from "@/components/GradientASCII";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 border-b border-white/5 overflow-hidden"
    >
      {/* Background GradientASCII Animation */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GradientASCII
          shape="horizon"
          mouseInteraction={false}
          clickEffect="wave"
          cellSize={16}
          speed={0.6}
          glyphOpacity={0.8}
          gradientOpacity={0.65}
        />
      </div>

      {/* Hero Title */}
      <div className="relative z-10 pointer-events-none w-full max-w-[96vw] px-2 sm:px-6 md:px-8 flex flex-col items-start justify-center">
        <ScrollReveal direction="up" duration={0.8} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-start gap-1 sm:gap-2"
          >
            <span className="font-syne italic text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white pl-1 select-none">
              Welcome to
            </span>
            <h1 className="w-full font-syne font-extrabold text-5xl sm:text-7xl md:text-9xl leading-[0.88] tracking-normal text-white uppercase whitespace-nowrap select-none drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)]">
              DEBPRIX
            </h1>
            <div className="w-full max-w-[96vw] pt-10">
          <ScrollReveal direction="up" duration={0.8} delay={0.2}>
            <p className="max-w-xl text-sm sm:text-base md:text-lg text-white/60 font-light leading-relaxed select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] pl-1">
              This is my World. A place where I share my projects, ideas, and
              passions. Dive in to explore the fusion of creativity and
              technology that defines who I am.
            </p>
          </ScrollReveal>
        </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
