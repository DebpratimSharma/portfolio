"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export interface CaseStudyItem {
  id: string;
  index: string;
  title: string;
  project: string;
  problem: string;
  solution: string;
  highlights: { metric: string; desc: string }[];
  tags: string[];
  projectUrl?: string;
}

interface ProblemAccordionProps {
  items: CaseStudyItem[];
}

export default function ProblemAccordion({ items }: ProblemAccordionProps) {
  const [openProblemId, setOpenProblemId] = useState<string | null>(
    items[0]?.id ?? null
  );

  if (!items || items.length === 0) return null;

  return (
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
        {items.map((item) => {
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
  );
}
