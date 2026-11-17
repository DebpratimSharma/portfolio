"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUp,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Code2,
} from "lucide-react";
import GradientASCII from "@/components/GradientASCII";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { cn } from "@/lib/utils";

// Custom inline SVG icons for GitHub & LinkedIn to ensure crisp rendering
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

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState<string>("");
  const { scrollTo } = useSmoothScroll();

  // Keep live local time updated
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setTimeString(
          now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      } catch {
        setTimeString(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Monitor when the footer spacer enters/leaves the viewport.
  // When nearby, the fixed background footer wakes up and activates rendering.
  useEffect(() => {
    setIsVisible(true);
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "400px 0px 400px 0px",
        threshold: 0,
      }
    );

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("debpratimsharma33@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleBackToTop = () => {
    scrollTo(0);
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative w-full h-dvh min-h-170 pointer-events-none"
    >
      {/* 
        Fixed reveal container:
        Stationed at the bottom of the viewport behind the main project layer (z-0).
        As the user scrolls past the Contact Me section, the opaque project layer 
        slides up like a shutter being lifted, progressively uncovering this footer.
      */}
      <div
        className={cn(
          "fixed bottom-0 left-0 w-full h-dvh min-h-170 z-0 flex flex-col justify-between overflow-hidden bg-black text-white px-5 sm:px-10 md:px-16 lg:px-20 py-8 sm:py-12 transition-opacity duration-300",
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Background GradientASCII Animation */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <GradientASCII
            preset="atmosphere"
            shape="rise"
            scale={2.25}
            cellSize={24}
            gradientOpacity={0.69}
            mouseInteraction={true}
            clickEffect="wave"
            speed={0.7}
            glyphOpacity={0.88}
            glow={0.25}
            className="w-full h-full"
          />
        </div>
        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between h-full pointer-events-none">
          

          {/* Heroic Statement & Direct Actions */}
          <div className="my-auto py-6 sm:py-10 flex flex-col items-start gap-4 sm:gap-6 pointer-events-auto">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>06 // READY TO TALK?</span>
            </div>

            <h2 className="font-syne font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight uppercase leading-[0.88] text-white select-none drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]">
              LET&apos;S WORK <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-white">
                TOGETHER.
              </span>
            </h2>

            <p className="max-w-xl text-sm sm:text-base md:text-lg text-white/70 font-light leading-relaxed">
              Have a high-impact product to ship, a distributed system to scale, or an engineering role to fill? Let&apos;s build something exceptional.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <a
                href="mailto:debpratimsharma33@gmail.com"
                className="group flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-black font-syne font-semibold text-xs sm:text-sm tracking-wide hover:bg-sky-200 transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>START A CONVERSATION</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={handleCopyEmail}
                className="group flex items-center gap-2.5 px-5 py-3 sm:py-3.5 rounded-full border border-white/15 bg-black/40 hover:bg-white/10 backdrop-blur-md font-mono text-xs text-white/90 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">
                      COPIED TO CLIPBOARD
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span>debpratimsharma33@gmail.com</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Bar: Brand & Social Links */}
          <div className="w-full border-t border-white/10 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            {/* Brand & Copyright */}
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-4 text-center sm:text-left">
              <span className="font-syne font-extrabold text-lg sm:text-xl text-white tracking-wider">
                DEBPRIX
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                © 2026 Debpratim Sharma. Built with Next.js & Motion.
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://github.com/DebpratimSharma"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-all hover:scale-110"
                title="GitHub"
              >
                <CustomGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/debpratim-sharma-916203267/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-all hover:scale-110"
                title="LinkedIn"
              >
                <CustomLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://leetcode.com/u/debpratimsharma/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-all hover:scale-110"
                title="LeetCode"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="mailto:debpratimsharma33@gmail.com"
                className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-all hover:scale-110"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
