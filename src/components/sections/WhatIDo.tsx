"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Briefcase, Code2, Compass, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import GradientASCII from "@/components/GradientASCII";
import { MainButton } from "@/components/ui/MainButton";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import ContributionSkyline, { ContributionDay } from "@/components/ui/contribution-skyline";
import AtAGlanceCard from "@/components/AtAGlanceCard";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const caseStudiesConfig = PORTFOLIO_DATA.caseStudies;
const caseStudies = caseStudiesConfig?.items ?? [];

export const TECH_STACK_CATEGORIES = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "C", "Java"],
  },
  {
    title: "Frontend",
    items: ["Next.js", "React", "Tailwind CSS", "Shadcn UI", "Motion", "HTML5 / CSS3"],
  },
  {
    title: "Backend",
    items: ["Node.js", "REST APIs", "FastAPI", "Express", "Serverless"],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "Supabase", "Upstash Redis", "MongoDB", "SQL"],
  },
  {
    title: "Infrastructure",
    items: ["Docker", "Vercel", "Google Cloud (GCP)", "AWS", "Git & GitHub", "Linux"],
  },
  {
    title: "Models & APIs",
    items: ["OpenAI API", "ElevenLabs", "Web Audio APIs", "Solana Web3"],
  },
];

export default function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isAtLeft, setIsAtLeft] = useState(false);
  const [contributions, setContributions] = useState<ContributionDay[] | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openProblemId, setOpenProblemId] = useState<string | null>(caseStudies[0]?.id ?? null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Fetch real GitHub contribution data
  useEffect(() => {
    let isMounted = true;
    async function fetchContributions() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.contributions)) {
          setContributions(json.contributions);
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn("Using sample contributions due to API fetch fallback:", err);
      }
    }

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pure scroll-triggered bi-directional animation (throttled with RAF to prevent layout thrashing)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Scroll threshold with generous hysteresis to prevent any jitter:
            if (rect.top <= windowHeight * 0.55) {
              setIsAtLeft(true);
            } else if (rect.top > windowHeight * 0.68) {
              setIsAtLeft(false);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="what-i-do"
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
          04
        </span>
        <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white capitalize drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] whitespace-nowrap">
          what i do
        </h2>
      </motion.div>

      {/* 
        Content Container:
        Reserved for 3rd party components / future content.
      */}
      <div
        className={cn(
          "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 transition-all duration-400 ease-out flex flex-col gap-12 sm:gap-16",
          isAtLeft
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        )}
      >
        {/* ========================================================
            PART 1: Identity, Core Focus, Targets & At-a-Glance
           ======================================================== */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Paragraph and bullets of points */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 px-1 sm:px-2">
            <div className="space-y-4">
              <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                Engineering resilient web systems from the boundaries up.
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                I build production-grade web systems with real users, balancing fluid, responsive client interfaces with resilient backend logic. Coming from an electrical engineering and IoT background, I approach software from a systems-first perspective—prioritizing database clarity, automated data lifecycles, low-latency API handoffs, and reliable uptime.
              </p>
            </div>

            {/* Bullets: Targets, Focus & Foundation */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-6 w-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    Target Roles
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light mt-0.5 leading-relaxed">
                    <span className="text-zinc-200 font-medium">Full-Stack Engineer</span> (Backend-leaning), <span className="text-zinc-200 font-medium">Backend Engineer</span>, and <span className="text-zinc-200 font-medium">Product / Frontend Engineer</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-6 w-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-3.5 h-3.5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    Core Focus
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light mt-0.5 leading-relaxed">
                    Production Next.js systems, relational modeling with PostgreSQL/Supabase, Redis caching & rate limiting, and multi-step AI API pipeline orchestration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-6 w-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Compass className="w-3.5 h-3.5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    Engineering Foundation
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light mt-0.5 leading-relaxed">
                    Electrical engineering & IoT roots grounding design decisions in clean system boundaries, memory efficiency, and dependable real-world durability.
                  </p>
                </div>
              </div>
            </div>

            {/* Action button redirecting to /about */}
            <div className="pt-2 flex items-center">
              <InteractiveHoverButton
                href="/about"
                className="text-xs sm:text-sm font-syne tracking-wide !py-2 !px-5"
              >
                More About Me
              </InteractiveHoverButton>
            </div>
          </div>

          {/* Right Column: "At a Glance" Card with GradientASCII background */}
          <div className="lg:col-span-5 flex flex-col">
            <AtAGlanceCard />
          </div>
        </div>

        {/* ========================================================
            TECH STACK: "What I work with" (Reference Design)
           ======================================================== */}
        <div className="w-full flex flex-col gap-6 sm:gap-8 pt-2">
          {/* Section Header with Quote / Note */}
          <div className="space-y-2 px-1 sm:px-2">
            <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              What I work with
            </h3>    
          </div>

          {/* 3-Column Minimalist Category Matrix */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-6 sm:gap-y-8 px-1 sm:px-2">
            {TECH_STACK_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="border-t border-white/10 pt-4 sm:pt-5 flex flex-col gap-2.5 sm:gap-3 group hover:border-white/25 transition-colors"
              >
                <span className="text-xs sm:text-sm font-mono text-zinc-500 group-hover:text-zinc-400 uppercase tracking-wider transition-colors">
                  {cat.title}
                </span>
                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 sm:gap-y-2.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm sm:text-base font-normal text-zinc-300 hover:text-white transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Contribution Skyline Section */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between mb-1 px-1 sm:px-2 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                GitHub Activity
              </span>
              <span className="text-zinc-700">•</span>
              <a
                href="https://github.com/DebpratimSharma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                @DebpratimSharma
                <span className="text-[10px] text-zinc-500">↗</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isLoaded ? "bg-emerald-400" : "bg-zinc-500"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    isLoaded ? "bg-emerald-500" : "bg-zinc-400"
                  )}
                />
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {isLoaded ? "Live GitHub Synced" : "Fetching live data..."}
              </span>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="h-[280px] w-full rounded-2xl border border-white/10 bg-zinc-950/60 animate-pulse flex items-center justify-center text-xs text-zinc-600 font-mono">
                Loading activity skyline...
              </div>
            }
          >
            <ContributionSkyline
              data={contributions}
              palette="github"
              defaultView="3d"
              className="border-white/10 bg-zinc-950 shadow-2xl rounded-2xl overflow-hidden"
            />
          </Suspense>
        </div>
        {/* ========================================================
            PART 2: Case Studies (Problems I Have Solved)
           ======================================================== */}
        {caseStudiesConfig?.enabled && (
          <div className="w-full flex flex-col gap-6 pt-2">
            {/* Section Header */}
            <div className="space-y-2 px-1 sm:px-2">
              <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Problems I Have Solved
              </h3>
              <p className="text-xs sm:text-sm font-mono text-zinc-400">
                Architectural decisions, real-world metrics, and production-tested solutions.
              </p>
            </div>

            {/* Smooth Motion Accordion */}
            <div className="w-full border border-white/10 rounded-2xl bg-black overflow-hidden shadow-2xl divide-y divide-white/10">
              {caseStudies.map((item) => {
                const isOpen = openProblemId === item.id;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "relative overflow-hidden group transition-colors duration-300",
                      isOpen ? "bg-white/5" : "hover:bg-white/[0.02]"
                    )}
                  >
                    {/* Header Trigger */}
                    <button
                      type="button"
                      onClick={() => setOpenProblemId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`problem-content-${item.id}`}
                      id={`problem-header-${item.id}`}
                      className="w-full px-4 sm:px-6 md:px-8 py-4.5 sm:py-5 text-left flex items-center justify-between cursor-pointer group transition-colors duration-300 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0 pr-3 sm:pr-4">
                        {/* 2-Digit Index */}
                        <span
                          className={cn(
                            "text-xs sm:text-sm font-mono font-medium select-none transition-colors duration-300 shrink-0",
                            isOpen ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                          )}
                        >
                          {item.index}
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
                          <h4
                            className={cn(
                              "font-syne text-base sm:text-lg md:text-xl font-bold tracking-tight transition-all duration-300 ease-out",
                              isOpen
                                ? "text-white translate-x-1.5"
                                : "text-zinc-300 group-hover:text-white group-hover:translate-x-1.5"
                            )}
                          >
                            {item.title}
                          </h4>
                          <span
                            className={cn(
                              "text-[11px] font-mono uppercase tracking-wider shrink-0 transition-colors duration-300",
                              isOpen ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"
                            )}
                          >
                            / {item.project}
                          </span>
                        </div>
                      </div>

                      {/* Smooth Rotating Chevron */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="shrink-0"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-colors duration-300",
                            isOpen ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                          )}
                        />
                      </motion.div>
                    </button>

                    {/* Smooth Animated Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`problem-content-${item.id}`}
                          role="region"
                          aria-labelledby={`problem-header-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: {
                                duration: 0.45,
                                ease: [0.16, 1, 0.3, 1],
                              },
                              opacity: {
                                duration: 0.35,
                                delay: 0.08,
                                ease: "easeOut",
                              },
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: {
                                duration: 0.32,
                                ease: [0.16, 1, 0.3, 1],
                              },
                              opacity: {
                                duration: 0.2,
                                ease: "easeIn",
                              },
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="w-full relative border-t border-white/10 p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
                            {/* Problem Row */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-6 pb-3.5 sm:pb-5 border-b border-white/5">
                              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 sm:w-24 pt-0.5">
                                Problem
                              </span>
                              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed flex-1">
                                {item.problem}
                              </p>
                            </div>

                            {/* Solution Row */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-6 pb-3.5 sm:pb-5 border-b border-white/5">
                              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 sm:w-24 pt-0.5">
                                Solution
                              </span>
                              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed flex-1">
                                {item.solution}
                              </p>
                            </div>

                            {/* Results Row */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-6 pb-3.5 sm:pb-5 border-b border-white/5">
                              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 sm:w-24 pt-0.5">
                                Results
                              </span>
                              <div className="flex flex-col gap-2.5 sm:gap-3 flex-1">
                                {item.highlights.map((h, i) => (
                                  <div
                                    key={i}
                                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 text-xs sm:text-sm"
                                  >
                                    <span className="font-medium text-white shrink-0 sm:min-w-[170px] font-syne">
                                      {h.metric}
                                    </span>
                                    <span className="text-zinc-400 font-light leading-relaxed text-xs sm:text-sm">
                                      {h.desc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Stack & Action Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-1">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:items-center gap-1.5 sm:gap-6">
                                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 sm:w-24">
                                  Stack
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase bg-white/[0.04] border border-white/10 text-zinc-300 select-none hover:border-white/20 transition-colors"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Live Project Action */}
                              {item.projectUrl && (
                                <div className="shrink-0 self-start sm:self-auto pl-0 sm:pl-4">
                                  <InteractiveHoverButton
                                    href={item.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-8 px-4 text-xs font-mono tracking-wider"
                                  >
                                    Live Project
                                  </InteractiveHoverButton>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
