import React from "react";
import {
  Briefcase,
  Code2,
  Compass,
  ShieldCheck,
  Database,
  Zap,
} from "lucide-react";
import AtAGlanceCard from "@/components/AtAGlanceCard";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { MotionFadeIn } from "@/components/ui/motion-fade-in";
import ProblemAccordion from "@/components/sections/ProblemAccordion";
import AboutGitHubActivity from "@/components/sections/AboutGitHubActivity";
import { PORTFOLIO_DATA, TECH_STACK_CATEGORIES } from "@/data/portfolio";

const caseStudiesConfig = PORTFOLIO_DATA.caseStudies;
const caseStudies = caseStudiesConfig?.items ?? [];

export default function AboutView() {
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
        <MotionFadeIn
          yOffset={20}
          duration={0.6}
          className="flex flex-col items-start text-left gap-1 pt-2 sm:pt-4"
        >
          
          <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white capitalize drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            About
          </h1>
        </MotionFadeIn>

        {/* ========================================================
            PART 1: Paragraph About Me on Left & At a Glance on Right
           ======================================================== */}
        <MotionFadeIn
          yOffset={24}
          duration={0.65}
          delay={0.1}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
        >
          {/* Left Column: Paragraph About Me and Core Focus Points */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 px-1 sm:px-2">
            <div className="space-y-4">
              <h2 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                Engineering resilient web systems from the boundaries up.
              </h2>
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
        </MotionFadeIn>

        {/* ========================================================
            PART 2: "How I Work" Section
           ======================================================== */}
        <MotionFadeIn
          yOffset={24}
          whileInView={true}
          duration={0.65}
          viewportMargin="-80px"
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
        </MotionFadeIn>

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
        <AboutGitHubActivity />

        {/* ========================================================
            PART 5: Case Studies (Problems I Have Solved)
           ======================================================== */}
        {caseStudiesConfig?.enabled && (
          <ProblemAccordion items={caseStudies} />
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
