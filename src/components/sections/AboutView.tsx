"use client";

import React, { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Briefcase,
  Code2,
  Compass,
  ChevronDown,
  Layers,
  ShieldCheck,
  Database,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AtAGlanceCard from "@/components/AtAGlanceCard";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import ContributionSkyline, {
  ContributionDay,
} from "@/components/ui/contribution-skyline";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { TECH_STACK_CATEGORIES } from "@/components/sections/WhatIDo";

const caseStudiesConfig = PORTFOLIO_DATA.caseStudies;
const caseStudies = caseStudiesConfig?.items ?? [];

export default function AboutView() {
  const [contributions, setContributions] = useState<ContributionDay[] | undefined>(
    undefined
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [openProblemId, setOpenProblemId] = useState<string | null>(
    caseStudies[0]?.id ?? null
  );

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

  return (
    <section className="relative w-full min-h-screen py-24 sm:py-32 bg-black select-none flex flex-col justify-start">
      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(56,189,248,0.12),transparent_70%)]"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col gap-16 sm:gap-20">
        {/* ========================================================
            PAGE HEADER: Heading "About"
           ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start text-left gap-1 pt-2 sm:pt-4"
        >
          
          <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white capitalize drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            About
          </h1>
        </motion.div>

        {/* ========================================================
            PART 1: Paragraph About Me on Left & At a Glance on Right
           ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
        >
          {/* Left Column: Paragraph About Me and Core Focus Points */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 px-1 sm:px-2">
            <div className="space-y-4">
              
              <div className="space-y-3.5 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                <p>
                  I'm Debpratim Sharma — Web Developer and Gen AI Engineer with a
                  strong focus on building and shipping real-world products using the React and
                  Next.js ecosystem. Coming from an electrical engineering and IoT background, I
                  approach software with a systems-first perspective—prioritizing database clarity,
                  automated data lifecycles, low-latency API handoffs, and reliable uptime.
                </p>
                <p>
                  I enjoy working close to production, thinking carefully about system boundaries,
                  architectural trade-offs, and long-term maintainability. Rather than just assembling
                  screens, I design systems that stay resilient under real-world usage—handling
                  ephemeral data lifecycles, defense against abuse, and graceful degradation across
                  third-party AI services.
                </p>
              </div>
            </div>

            {/* Bullets: Targets, Focus & Foundation */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-6 w-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Target Roles
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light mt-0.5 leading-relaxed">
                    <span className="text-zinc-200 font-medium">Full-Stack Engineer</span>,{" "}
                    <span className="text-zinc-200 font-medium">Backend Engineer</span>, and{" "}
                    <span className="text-zinc-200 font-medium">Product / Frontend Engineer</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-6 w-6 rounded-md bg-white/6 border border-white/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-3.5 h-3.5 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Core Focus
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light mt-0.5 leading-relaxed">
                    Production Next.js systems, relational modeling with PostgreSQL/Supabase, Redis
                    caching &amp; rate limiting, and multi-step AI API pipeline orchestration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-6 w-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Compass className="w-3.5 h-3.5 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Engineering Foundation
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light mt-0.5 leading-relaxed">
                    Electrical engineering &amp; IoT roots grounding design decisions in clean
                    system boundaries, memory efficiency, and dependable real-world durability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: "At a Glance" Card */}
          <div className="lg:col-span-5 flex flex-col">
            <AtAGlanceCard />
          </div>
        </motion.div>

        {/* ========================================================
            PART 2: "How I Work" Section
           ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col gap-6 pt-2"
        >
          <div className="space-y-2 px-1 sm:px-2">
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Methodology &amp; Architecture
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              How I Work
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light max-w-4xl">
              I treat software systems like distributed electronic hardware: every component has an
              explicit operating envelope, input contracts, and failure tolerances. When building
              software, I design defensively around three non-negotiables:
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 px-1 sm:px-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 flex flex-col gap-3.5 hover:border-white/20 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-syne text-lg font-bold text-white tracking-wide">
                Defensive API Boundaries
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                External dependencies—whether AI models, cloud storage, or external APIs—are treated
                as fallible subsystems. I isolate them behind timeouts, rate limiters, and defensive
                fallbacks so the application degrades gracefully rather than crashing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 flex flex-col gap-3.5 hover:border-white/20 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-200">
                <Database className="w-5 h-5 text-sky-400" />
              </div>
              <h4 className="font-syne text-lg font-bold text-white tracking-wide">
                Lifecycle &amp; Relational Clarity
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Unbounded data growth degrades query plans and inflates costs. I model databases with
                relational rigor in PostgreSQL and Supabase, pair them with sub-millisecond Redis
                caches, and automate TTL lifecycles through scheduled cron workers.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 flex flex-col gap-3.5 hover:border-white/20 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-200">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="font-syne text-lg font-bold text-white tracking-wide">
                Low Latency &amp; Fluid UX
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Performance is an engineering spec, not a cosmetic layer. By optimizing client-side
                state, utilizing optimistic updates, and leveraging hardware-accelerated Motion
                animations, users experience responsive 60/120 FPS feedback at every interaction.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            PART 3: TECH STACK - "What I work with"
           ======================================================== */}
        <div className="w-full flex flex-col gap-6 sm:gap-8 pt-2">
          {/* Section Header */}
          <div className="space-y-2 px-1 sm:px-2">
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Capabilities &amp; Tools
            </span>
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

        {/* ========================================================
            PART 4: GitHub Contribution Skyline Section
           ======================================================== */}
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
            PART 5: Case Studies (Problems I Have Solved)
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
                            <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-6 pb-3.5 sm:pb-5 border-b border-white/5">
                              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 sm:w-24 pt-0.5">
                                Problem
                              </span>
                              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed flex-1">
                                {item.problem}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-6 pb-3.5 sm:pb-5 border-b border-white/5">
                              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 sm:w-24 pt-0.5">
                                Solution
                              </span>
                              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed flex-1">
                                {item.solution}
                              </p>
                            </div>

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

        {/* ========================================================
            PART 6: "See My Journey" Action Section
           ======================================================== */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl border border-white/15 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
              Milestones &amp; Experience
            </span>
            <h4 className="font-syne text-xl sm:text-2xl font-bold text-white tracking-tight">
              Curious about my career journey and experience?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Explore my timeline across client development, hackathon awards, and student chapter leadership.
            </p>
          </div>
          <InteractiveHoverButton
            href="/#experience"
            className="shrink-0 !py-2.5 !px-6 !text-sm font-syne font-semibold"
          >
            See My Journey
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  );
}
