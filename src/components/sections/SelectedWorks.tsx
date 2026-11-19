"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { MainButton } from "@/components/ui/MainButton";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextAnimate } from "@/components/ui/text-animate";

// Official circular GitHub icon matching the reference image
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 shrink-0"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export default function SelectedWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isAtLeft, setIsAtLeft] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const [cursorTextKey, setCursorTextKey] = useState(0);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const isCursorVisible = hoveredProject !== null && !isOverInteractive;

  // Pure scroll-triggered bi-directional animation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Scroll threshold with generous hysteresis to prevent any jitter:
      if (rect.top <= windowHeight * 0.55) {
        setIsAtLeft(true);
      } else if (rect.top > windowHeight * 0.68) {
        setIsAtLeft(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 sm:py-24 border-b border-white/5 bg-black select-none flex flex-col justify-start"
    >
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
          02
        </span>
        <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white capitalize drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] whitespace-nowrap">
          selected works
        </h2>
      </motion.div>

      <div
        className={cn(
          "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-28 sm:pt-36 md:pt-40 pb-16 transition-all duration-400 ease-out flex flex-col",
          isAtLeft
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        )}
      >
        {/* Top dividing border */}
        <div className="w-full border-t border-white/10" />

        {/* Project rows (Pure natural scroll, NO inner scrollbar!) */}
        <div className="flex flex-col">
          {PORTFOLIO_DATA.projects.map((project, idx) => {
            const handleRowClick = (e: React.MouseEvent) => {
              if ((e.target as HTMLElement).closest("a")) return;
              const targetUrl = project.link || project.github;
              if (targetUrl) {
                window.open(targetUrl, "_blank", "noopener,noreferrer");
              }
            };

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                animate={
                  isAtLeft
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 14 }
                }
                transition={{
                  duration: 0.35,
                  delay: isAtLeft ? idx * 0.035 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={handleRowClick}
                onMouseEnter={() => {
                  setHoveredProject(project.id);
                  setCursorTextKey((prev) => prev + 1);
                }}
                onMouseLeave={() => setHoveredProject(null)}
                className={cn(
                  "group relative w-full py-5 sm:py-7 border-b border-white/10 transition-colors duration-300 px-2 sm:px-4",
                  isCursorVisible ? "md:cursor-none cursor-pointer" : "cursor-pointer"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
                  {/* Left Column: Number + Title + Description */}
                  <div className="flex items-start gap-4 sm:gap-6 md:gap-8 max-w-2xl">
                    {/* 2-Digit Index */}
                    <span className="text-xs sm:text-sm font-mono text-zinc-500 font-medium pt-1 shrink-0 select-none group-hover:text-zinc-400 transition-colors">
                      {project.number || `0${idx + 1}`}
                    </span>

                    {/* Title & Description */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight group-hover:text-white group-hover:translate-x-3 sm:group-hover:translate-x-4 transition-transform duration-300 ease-out">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Tech Stack Pills (Line 1) and Action Buttons (Line 2) in separate lines */}
                  <div className="flex flex-col items-start lg:items-end justify-center gap-3.5 sm:gap-4 shrink-0 pl-8 lg:pl-0 pt-1 lg:pt-0">
                    {/* Line 1: Tech Stack Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 lg:justify-end">
                      {project.tech.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase bg-white/[0.04] border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white transition-colors select-none"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Line 2: GitHub Button */}
                    <div className="flex items-center lg:justify-end">
                      {project.github && (
                        <div
                          onMouseEnter={() => setIsOverInteractive(true)}
                          onMouseLeave={() => setIsOverInteractive(false)}
                        >
                          <MainButton
                            variant="secondary"
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<GithubIcon className="w-3.5 h-3.5 shrink-0" />}
                            textColor="text-zinc-300"
                            className="!py-1.5 sm:!py-2 !px-3.5 sm:!px-4 !text-xs sm:!text-[13px] min-w-[95px]"
                            aria-label={`${project.title} GitHub repository`}
                          >
                            GitHub
                          </MainButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <InteractiveHoverButton
          href={PORTFOLIO_DATA.socials.find((s) => s.label === "GitHub")?.href.concat("?tab=repositories")}
          className=" mx-auto text-center justify-center mt-10 py-2.5 "
        >
          View All
        </InteractiveHoverButton>

      </div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isCursorVisible ? 1 : 0,
          opacity: isCursorVisible ? 1 : 0,
        }}
        transition={{
          scale: { type: "spring", damping: 22, stiffness: 350 },
          opacity: { duration: 0.15 },
        }}
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-black flex items-center justify-center text-center p-3 shadow-[0_12px_40px_rgba(255,255,255,0.35)] select-none">
          <TextAnimate
            key={cursorTextKey}
            animation="blurInUp"
            by="character"
            duration={0.25}
            as="span"
            startOnView={false}
            className="font-syne font-bold text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-black leading-none text-center !whitespace-nowrap"
            segmentClassName="tracking-[0.16em]"
          >
            go to site
          </TextAnimate>
        </div>
      </motion.div>
    </section>
  );
}
