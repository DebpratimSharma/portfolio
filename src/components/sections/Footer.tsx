"use client";

import React from "react";
import { motion } from "motion/react";
import ScrollReveal from "@/components/ScrollReveal";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative w-full h-screen min-h-screen flex items-center justify-center px-8 border-b border-white/5 overflow-hidden"
    >
      <div className="relative z-10 pointer-events-none">
        <ScrollReveal direction="up" duration={0.8}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              06
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white capitalize drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              footer
            </h2>
          </motion.div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
