"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mail, Code2 } from "lucide-react";
import GradientASCII from "@/components/GradientASCII";
import AnimatedNavLink from "@/components/ui/animated-nav-link";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

// Custom inline SVG icons for GitHub & LinkedIn in the circular badges
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

interface NavLinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface NavColumn {
  title: string;
  links: NavLinkItem[];
}

const navColumns: NavColumn[] = [
  {
    title: "Find Work",
    links: [
      { label: "Explore Jobs", href: "#projects" },
      { label: "Discover Companies", href: "#experience" },
      { label: "Browse Collections", href: "#what-i-do" },
    ],
  },
  {
    title: "Find People",
    links: [
      { label: "Learn More", href: "#hero" },
      {
        label: "Sign up",
        href: "https://docs.google.com/document/d/1WXOgpowX7oe__Q_SAY8FImyXG62uJkWQDFlxInrUHyk/edit?usp=sharing",
        isExternal: true,
      },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#hero" },
      {
        label: "Careers",
        href: "https://www.linkedin.com/in/debpratim-sharma-916203267/",
        isExternal: true,
      },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

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

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavLinkItem
  ) => {
    if (item.href.startsWith("#")) {
      e.preventDefault();
      scrollTo(item.href);
    }
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative w-full h-[85dvh] min-h-[580px] pointer-events-none"
    >
      {/* 
        Fixed reveal container:
        Stationed at the bottom of the viewport behind the main project layer (z-0).
        Its height is 85% of the screen so that the contact section's bottom (which acts 
        as the shutter) stays visible at the top 15% when scrolled all the way to the end.
      */}
      <div
        className={cn(
          "fixed bottom-0 left-0 w-full h-[85dvh] min-h-[580px] z-0 flex flex-col justify-between overflow-hidden bg-black text-white px-6 sm:px-10 md:px-14 lg:px-20 pt-6 sm:pt-10 pb-0 transition-opacity duration-300",
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
            gradientOpacity={0.9}
            mouseInteraction={true}
            clickEffect="wave"
            speed={0.7}
            glyphOpacity={0.88}
            glow={0.25}
            className="w-full h-full"
          />
        </div>

        {/* Cinematic gradient overlays for contrast & depth */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/85 via-black/20 to-black/75" />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_bottom,transparent_35%,rgba(0,0,0,0.75)_100%)]" />

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between h-full pointer-events-none">
          {/* Top Section: Left Branding & Right Nav Columns */}
          <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 pt-2 sm:pt-4 pointer-events-auto">
            {/* Top Left: Headline, Credit Box & Social Icons */}
            <div className="flex flex-col items-start gap-4 sm:gap-5 max-w-md">
              <span className="font-syne font-bold text-sm sm:text-base text-white tracking-wide select-none">
                Let's Collab
              </span>

              {/* In place of the text input box of email */}
              <div className="flex items-center px-4 py-2.5 rounded-lg border border-white/20 bg-white/[0.04] backdrop-blur-sm text-xs sm:text-[13px] font-mono text-zinc-300 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                <span>© 2026 Debpratim Sharma. Built with Next.js & Motion.</span>
              </div>

              {/* Circular Social Icons */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://github.com/DebpratimSharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <CustomGithub className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/debpratim-sharma-916203267/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <CustomLinkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://leetcode.com/u/debpratimsharma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  title="LeetCode"
                  aria-label="LeetCode"
                >
                  <Code2 className="w-4 h-4" />
                </a>
                <a
                  href="mailto:debpratimsharma33@gmail.com"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  title="Email"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Top Right: Columns of Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 w-full lg:w-auto">
              {navColumns.map((col) => (
                <div key={col.title} className="flex flex-col items-start gap-2.5 sm:gap-3">
                  <h4 className="font-syne font-semibold text-sm sm:text-base text-white tracking-wide mb-1 select-none">
                    {col.title}
                  </h4>
                  <div className="flex flex-col items-start gap-1 sm:gap-1.5">
                    {col.links.map((link) => (
                      <AnimatedNavLink
                        key={link.label}
                        href={link.href}
                        animation="blurInUp"
                        by="character"
                        duration={0.25}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        onClick={(e) => handleLinkClick(e, link)}
                        className="font-syne text-xs sm:text-sm md:text-[15px] text-zinc-400 hover:text-white transition-colors py-0.5"
                      >
                        {link.label}
                      </AnimatedNavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Massive Brand Word Spanning Edge-to-Edge */}
          <div className="flex items-center justify-start pointer-events-none select-none pb-50 mx-auto overflow-visible">
            <h1 className="font-syne font-extrabold text-5xl md:text-[10rem] leading-[0.78]  text-white/95 select-none whitespace-nowrap translate-y-[3%] sm:translate-y-[10%] max-w-full">
              DEBPRIX
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
}
