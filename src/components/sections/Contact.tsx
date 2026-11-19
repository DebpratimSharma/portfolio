"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mail, Search, Clock, Copy, Check, MessageSquare, Code2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MainButton } from "@/components/ui/MainButton";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { PORTFOLIO_DATA } from "@/data/portfolio";

// Custom SVG components for GitHub & LinkedIn matching Footer.tsx and portfolio design
const CustomGithub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const CustomLinkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Scroll detection to slowly disappear the centered heading on scroll down
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Hysteresis threshold to smoothly transition on scroll down/up
      if (rect.top <= windowHeight * 0.10) {
        setIsScrolled(true);
      } else if (rect.top > windowHeight * 0.25) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(PORTFOLIO_DATA.email || "debpratimsharma33@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 sm:py-28 border-b border-white/5 bg-black select-none flex flex-col justify-start"
    >
      {/* 
        Centered Section Heading:
        - Stays horizontally centered at left: 50% (x: -50%).
        - Slowly disappears on scroll down with a smooth fade and subtle lift.
      */}
      <motion.div
        initial={false}
        animate={{
          top: "clamp(5.5rem, 9vh, 6.5rem)",
          left: "50%",
          x: "-50%",
          y: isScrolled ? -28 : 0,
          scale: isScrolled ? 0.95 : 1,
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          originX: 0.5,
          originY: 0.5,
        }}
        className={cn(
          "absolute z-20 flex flex-col w-max items-center text-center select-none",
          isScrolled ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-500 uppercase">
          05
        </span>
        <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white capitalize drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] whitespace-nowrap">
          contact
        </h2>
      </motion.div>

      {/* 
        Content Container:
        Fades in smoothly as the centered heading disappears on scroll.
      */}
      <div
        className={cn(
          "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-28 sm:pt-36 md:pt-40 pb-20 sm:pb-28 transition-all duration-700 ease-out flex flex-col gap-8 sm:gap-10",
          isScrolled
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-8 pointer-events-none"
        )}
      >
        

        {/* Header Row: Name, Subtitle Role & Status */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 sm:pb-8 border-b border-white/10">
          <div className="flex flex-col">
            <h3 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {PORTFOLIO_DATA.name}
            </h3>
            <p className="font-sans text-sm sm:text-base md:text-lg font-medium text-cyan-400 mt-2 tracking-wide">
              {PORTFOLIO_DATA.role}
            </p>
          </div>

          {/* Status Header Badge with Pulsing Light */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto pt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-zinc-400 uppercase select-none">
              {PORTFOLIO_DATA.status}
            </span>
          </div>
        </div>

        {/* Middle Section: Left Info Blocks & Right Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-2 sm:py-4">
          {/* Left Column: Current Status & Looking For */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-7">
            {/* Current Status Block */}
            <div className="flex flex-col items-start gap-2.5">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Current Status</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 w-fit shadow-[0_0_12px_rgba(16,185,129,0.12)] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{PORTFOLIO_DATA.status}</span>
              </div>
            </div>

            {/* Looking For Block */}
            <div className="flex flex-col items-start gap-2.5">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <span>Looking For</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {PORTFOLIO_DATA.roles.map((role) => (
                  <span
                    key={role}
                    className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono text-zinc-300 bg-white/[0.04] border border-white/10 select-none"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Mail Me Button & Social Icon Buttons */}
          <div className="lg:col-span-5 flex flex-col items-stretch sm:items-center lg:items-end gap-4">
            {/* Main Mail Me Button using MainButton */}
            <MainButton
              variant="primary"
              href={`mailto:${PORTFOLIO_DATA.email}`}
              icon={<Mail className="w-4 h-4" />}
              iconPosition="left"
              className="w-full sm:w-auto min-w-[220px] text-center"
            >
              Mail Me
            </MainButton>

            {/* Social Icon Buttons (GitHub, LinkedIn, LeetCode) */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center lg:justify-end">
              <a
                href="https://github.com/DebpratimSharma"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 sm:px-6 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white hover:text-black hover:border-white text-zinc-300 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                title="GitHub Profile"
                aria-label="GitHub"
              >
                <CustomGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/debpratim-sharma-916203267/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 sm:px-6 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white hover:text-black hover:border-white text-zinc-300 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                title="LinkedIn Profile"
                aria-label="LinkedIn"
              >
                <CustomLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://leetcode.com/u/debpratimsharma/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 sm:px-6 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white hover:text-black hover:border-white text-zinc-300 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                title="LeetCode Profile"
                aria-label="LeetCode"
              >
                <Code2 className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Direct Message Option via TellWeb (Unboxed Row with Border Separation) */}
        <div className="w-full py-6 sm:py-7 border-y border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
           
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-syne font-semibold text-white">
                  Want to send a direct message?
                </span>
                
              </div>
              <span className="text-xs sm:text-sm font-mono text-zinc-400">
                Drop an instant or anonymous note at{" "}
                <a
                  href={PORTFOLIO_DATA.tellwebUrl || "https://tellweb.debprix.in/ear/me_ur_deb"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 font-medium underline decoration-white/20 underline-offset-2 hover:text-cyan-400 hover:decoration-cyan-400 transition-colors"
                >
                  tellweb.debprix.in/ear/me_ur_deb
                </a>
              </span>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <InteractiveHoverButton
              href={PORTFOLIO_DATA.tellwebUrl || "https://tellweb.debprix.in/ear/me_ur_deb"}
              target="_blank"
              rel="noopener noreferrer"
              className="!text-xs !py-2 !px-5"
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Send Message
            </InteractiveHoverButton>
          </div>
        </div>

        {/* Bottom Row: Direct Email & Response Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Direct Email Link & Copy Button */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              DIRECT
            </span>
            <a
              href={`mailto:${PORTFOLIO_DATA.email}`}
              className="text-zinc-300 hover:text-white transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-white"
            >
              {PORTFOLIO_DATA.email}
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors ml-0.5 hover:bg-white/5 active:scale-95"
              title="Copy email to clipboard"
              aria-label="Copy email address"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            {copied && (
              <span className="text-[11px] text-emerald-400 font-mono animate-in fade-in duration-200">
                Copied!
              </span>
            )}
          </div>

          {/* Response Time Indicator */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-zinc-400">
            <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
            <span>Response time: {PORTFOLIO_DATA.responseTime || "< 24 hours"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
