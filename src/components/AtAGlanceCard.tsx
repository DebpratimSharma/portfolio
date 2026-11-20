"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import GradientASCII from "@/components/GradientASCII";
import { MainButton } from "@/components/ui/MainButton";

interface AtAGlanceCardProps {
  className?: string;
}

export default function AtAGlanceCard({ className }: AtAGlanceCardProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <div
      className={cn(
        "relative h-full w-full rounded-2xl border border-white/20 bg-zinc-950 p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden min-h-[360px] sm:min-h-[380px]",
        className
      )}
    >
      {/* On mobile: lightweight CSS radial gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none md:hidden opacity-40 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(30, 63, 216, 0.28), rgba(56, 189, 248, 0.12) 50%, transparent 80%)",
        }}
      />

      {/* On desktop: GradientASCII Animation */}
      {isDesktop && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden hidden md:block">
          <GradientASCII
            shape="rise"
            mouseInteraction={false}
            clickEffect="none"
            cellSize={16}
            speed={0.5}
            glyphOpacity={1}
            gradientOpacity={0.6}
            depthOfField={1}
          />
        </div>
      )}

      {/* Card Foreground Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Header with status badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            At a Glance
          </span>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for Work
          </div>
        </div>

        {/* Key snapshot details */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/5 pb-2.5 gap-1">
            <span className="text-xs font-mono text-zinc-500 uppercase">Based in</span>
            <span className="text-sm font-medium text-white">West Bengal, India (Remote-Ready)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/5 pb-2.5 gap-1">
            <span className="text-xs font-mono text-zinc-500 uppercase">Work Mostly in</span>
            <span className="text-sm font-medium text-white">TypeScript · JavaScript · PostgreSQL · Java</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/5 pb-2.5 gap-1">
            <span className="text-xs font-mono text-zinc-500 uppercase">Comfortable across</span>
            <span className="text-sm font-medium text-zinc-300">Next.js · React · Node.js · Supabase</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/5 pb-2.5 gap-1">
            <span className="text-xs font-mono text-zinc-500 uppercase">Looking for</span>
            <span className="text-sm font-medium text-white">Full-Stack · Backend · GenAI Roles</span>
          </div>
        </div>
      </div>

      {/* Bottom Resume Button - exactly as Hero.tsx */}
      <div className="relative z-10 pt-6 mt-auto">
        <MainButton
          variant="primary"
          href="/resume.pdf"
          download="Debpratim_Sharma_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          icon={<Download className="w-4 h-4" strokeWidth={2.4} />}
          aria-label="Resume"
          className="w-full sm:w-auto"
        >
          RESUME
        </MainButton>
      </div>
    </div>
  );
}
