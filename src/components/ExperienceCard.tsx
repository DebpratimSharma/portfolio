"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import GradientASCII from "@/components/GradientASCII";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export interface ExperienceItem {
  id?: number;
  role: string;
  organisation: string;
  location?: string;
  period: string;
  timelineDate?: string;
  link?: string;
  type?: string;
  preset?: string;
  summary?: string;
  contributions: string[];
  focus: string[];
  techStack: string[];
}

export interface ExperienceCardProps {
  experience: ExperienceItem;
  className?: string;
}

const PRESET_LIST = ["atmosphere", "lagoon", "corona", "rose"];

const PRESET_GRADIENTS: Record<string, string> = {
  atmosphere:
    "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(30, 63, 216, 0.25), rgba(56, 189, 248, 0.12) 50%, transparent 80%)",
  lagoon:
    "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(13, 148, 136, 0.25), rgba(94, 234, 212, 0.12) 50%, transparent 80%)",
  corona:
    "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(120, 53, 15, 0.25), rgba(245, 158, 11, 0.12) 50%, transparent 80%)",
  rose:
    "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(159, 18, 57, 0.25), rgba(244, 63, 94, 0.12) 50%, transparent 80%)",
};

export default function ExperienceCard({
  experience,
  className,
}: ExperienceCardProps) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Use the item's custom preset or assign one of the 4 rise presets by id
  const assignedPreset =
    experience.preset ||
    PRESET_LIST[((experience.id ?? 1) - 1) % PRESET_LIST.length];

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="group relative rounded-2xl border border-white/10 p-5 sm:p-7 md:p-8 transition-all duration-300 hover:border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* On mobile: lightweight CSS radial gradient matching the preset style (0 GPU overhead) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none md:hidden opacity-40 transition-opacity duration-500"
          style={{
            background:
              PRESET_GRADIENTS[assignedPreset] || PRESET_GRADIENTS.atmosphere,
          }}
        />

        {/* On desktop: full animated GradientASCII */}
        {isDesktop && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-15 group-hover:opacity-25 transition-opacity duration-500 hidden md:block">
            <GradientASCII
              preset={assignedPreset}
              shape="rise"
              mouseInteraction={false}
              cellSize={14}
              speed={0.4}
              glyphOpacity={0.65}
              gradientOpacity={0.5}
              depthOfField={0.4}
            />
          </div>
        )}

        {/* Foreground Content */}
        <div className="relative z-10">
          {/* Header: Role, Type Badge, Organization, Location, and Interactive Platform Link */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h4 className="font-syne text-xl sm:text-2xl font-bold text-white transition-colors">
                  {experience.role}
                </h4>
                
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ">
                <span className="font-medium text-zinc-400">
                  {experience.organisation}
                </span>
                {experience.location && (
                  <>
                    <span className="text-zinc-600 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      {experience.location}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Platform Link using InteractiveHoverButton without blur */}
            {experience.link && (
              <div className="shrink-0 self-start">
                <InteractiveHoverButton
                  href={experience.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="backdrop-blur-none !text-xs !py-1.5 !px-3.5 border-white/15 hover:border-white/40"
                  variant="primary"
                >
                  {experience.link.replace(/^https?:\/\//, "")}
                </InteractiveHoverButton>
              </div>
            )}
          </div>

          {/* Bullet Points from resume.pdf */}
          <ul className="space-y-2.5 my-5 text-sm sm:text-[15px] opacity-70 text-zinc-300 leading-relaxed font-sans">
            {experience.contributions.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Footer: Unified keywords (focus & tech stacks combined) */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {Array.from(
              new Set([
                ...(experience.focus || []),
                ...(experience.techStack || []),
              ])
            ).map((keyword, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase bg-white/[0.04] border border-white/10 text-zinc-500 hover:border-white/30 hover:text-white transition-colors select-none"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
