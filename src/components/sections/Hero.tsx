"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Download, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import GradientASCII from "@/components/GradientASCII";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [resumeHoverKey, setResumeHoverKey] = useState(0);
  const [isResumeHovered, setIsResumeHovered] = useState(false);

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
          depthOfField={0.6}
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
            <div className="w-full max-w-[96vw] pt-5 sm:pt-8 flex flex-col items-start gap-5 sm:gap-6">
              <ScrollReveal direction="up" duration={0.8} delay={0.2}>
                <p className="max-w-xl text-sm sm:text-base md:text-lg text-white/60 font-light leading-relaxed select-none pl-1">
                  This is my World. A place where I share my projects, ideas, and passions. Dive in to explore the fusion of creativity and technology that defines who I am.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up" duration={0.8} delay={0.35}>
                <div className="flex items-center gap-4 pl-1 pointer-events-auto">
                  <h1
                    className="font-syne font-semibold text-lg sm:text-xl md:text-4xl text-white tracking-wide select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                  >
                    Debpratim Sharma
                  </h1>

                  {/* Primary Resume Button */}
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => {
                      setIsResumeHovered(true);
                      setResumeHoverKey((prev) => prev + 1);
                    }}
                    onMouseLeave={() => setIsResumeHovered(false)}
                    className={cn(
                      "group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-7 sm:px-8 py-3 rounded-full font-syne font-bold text-xs sm:text-sm tracking-[0.16em] uppercase cursor-pointer select-none transition-all duration-300 ease-out border shadow-sm active:scale-95",
                      isResumeHovered
                        ? "bg-black text-white border-white shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                        : "bg-white text-black border-white hover:bg-black hover:text-white"
                    )}
                    aria-label="Resume"
                  >
                    <Download
                      className={cn(
                        "w-4 h-4 shrink-0 transition-all duration-300",
                        isResumeHovered
                          ? "text-white -translate-y-0.5"
                          : "text-black group-hover:text-white group-hover:-translate-y-0.5"
                      )}
                      strokeWidth={2.4}
                    />
                    <TextAnimate
                      key={resumeHoverKey}
                      animation="blurInUp"
                      by="character"
                      duration={0.25}
                      as="span"
                      startOnView={false}
                      className={cn(
                        "inline-block font-syne font-bold text-xs tracking-[0.16em] uppercase transition-colors duration-300",
                        isResumeHovered
                          ? "text-white"
                          : "text-black group-hover:text-white"
                      )}
                      segmentClassName="tracking-[0.16em]"
                    >
                      RESUME
                    </TextAnimate>
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Bottom Left: Keywords, Role & Location */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 right-0 z-20 pointer-events-none px-4 sm:px-8 md:px-12">
        <div className="w-full max-w-[96vw] px-2 sm:px-6 md:px-8 mx-auto">
          <ScrollReveal direction="up" duration={0.8} delay={0.45}>
            <div className="flex flex-col items-start gap-1 sm:gap-1.5 pl-1 select-none pointer-events-auto">
              <h2 className="font-syne pt-3 border-t border-white/50 font-bold text-base sm:text-xl text-white tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                Gen AI <span className="text-white/40 font-normal mx-1 sm:mx-1.5">.</span> React{" "}
                <span className="text-white/40 font-normal mx-1 sm:mx-1.5">.</span> Design{" "}
                <span className="text-white/40 font-normal mx-1 sm:mx-1.5">.</span> Blockchain
              </h2>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-zinc-400 font-light tracking-wide">
                <span>Full-Stack Developer</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Halisahar, West Bengal, India</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
