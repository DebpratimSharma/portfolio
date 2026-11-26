"use client";

import React from "react";
import { Download, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import GradientASCII from "@/components/GradientASCII";
import { MainButton } from "@/components/ui/MainButton";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[100svh] sm:h-screen sm:min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 overflow-hidden"
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
        <div className="w-full flex flex-col items-start gap-1 sm:gap-2">
          <ScrollReveal direction="up" duration={0.8} className="w-full flex flex-col items-start gap-1 sm:gap-2">
            <span className="font-syne italic text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white pl-1 select-none">
              Welcome to
            </span>
            <h1 className="w-full font-syne font-extrabold text-[clamp(2rem,11vw,3.5rem)] sm:text-7xl md:text-9xl leading-[0.88] tracking-normal text-white uppercase whitespace-nowrap select-none drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)]">
              DEBPRIX
            </h1>
          </ScrollReveal>

          <div className="w-full max-w-[96vw] pt-5 sm:pt-8 flex flex-col items-start gap-5 sm:gap-6">
            <ScrollReveal direction="up" duration={0.8} delay={0.2}>
              <p className="max-w-xl text-sm sm:text-base md:text-lg text-white/60 font-light leading-relaxed select-none pl-1">
                Full-Stack Web Developer, Gen AI Engineer &amp; Freelance React Developer based in Kolkata. Dive in to explore the fusion of creativity, AI systems, and robust web applications.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" duration={0.8} delay={0.35}>
              <div className="flex items-center gap-2 min-[375px]:gap-2.5 sm:gap-3 md:gap-4 pl-1 pointer-events-auto">
                <h2
                  className="font-syne font-semibold text-sm min-[375px]:text-base sm:text-xl md:text-4xl text-white tracking-wide whitespace-nowrap select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                >
                  Debpratim Sharma
                </h2>

                {/* Primary Resume Button */}
                <MainButton
                  variant="primary"
                  href="/resume.pdf"
                  download="Debpratim_Sharma_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.4} />}
                  className="shrink-0 whitespace-nowrap px-3.5 py-2 gap-1.5 text-[10px] tracking-[0.1em] min-[375px]:px-4 min-[375px]:py-2.5 min-[375px]:text-[11px] min-[375px]:tracking-[0.12em] sm:px-8 sm:py-3 sm:gap-3 sm:text-sm sm:tracking-[0.16em]"
                  aria-label="Resume"
                >
                  RESUME
                </MainButton>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom Left: Badge Card inspired by reference, Keywords & Location */}
      <div className="absolute bottom-[calc(5rem+env(safe-area-inset-bottom))] sm:bottom-8 md:bottom-10 left-0 right-0 z-20 pointer-events-none px-4 sm:px-8 md:px-12">
        <div className="w-full max-w-[96vw] px-2 sm:px-6 md:px-8 mx-auto">
          <ScrollReveal direction="up" duration={0.8} delay={0.45}>
            <div className="flex flex-col items-start gap-2.5 sm:gap-3 pl-1 select-none pointer-events-auto max-w-xl">

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                {["Web Developer", "Gen AI Engineer", "Freelancer", "React Developer"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase bg-white/[0.04] border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
                  >
                    {tag}
                  </span>
                ))}

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-light">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Kolkata, West Bengal, India</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
