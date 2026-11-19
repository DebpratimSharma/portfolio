"use client";
import type { Variants } from "motion/react";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export interface TimelineProps {
  data: TimelineEntry[];
  title?: string;
  description?: string;
  className?: string;
  animateIn?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.55,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const Timeline = ({
  data,
  title,
  description,
  className,
  animateIn,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(ref.current);
    window.addEventListener("resize", updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className={cn("w-full bg-transparent font-sans", className)}
      ref={containerRef}
    >
      {(title || description) && (
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:px-10">
          {title && (
            <h2 className="text-xl md:text-4xl mb-4 text-white font-syne font-bold max-w-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-neutral-400 text-sm md:text-base max-w-sm">
              {description}
            </p>
          )}
        </div>
      )}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-16">
        <motion.div
          variants={animateIn !== undefined ? containerVariants : undefined}
          initial={animateIn !== undefined ? "hidden" : undefined}
          animate={
            animateIn !== undefined
              ? animateIn
                ? "visible"
                : "hidden"
              : undefined
          }
        >
          {data.map((item, index) => (
            <motion.div
              key={index}
              variants={animateIn !== undefined ? itemVariants : undefined}
              className={cn(
                "flex justify-start md:gap-10",
                index === 0 ? "pt-4 md:pt-10" : "pt-12 md:pt-24"
              )}
            >
              <div className="sticky flex flex-col md:flex-row z-30 items-center top-28 md:top-36 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black border border-[#38bdf8]/30 flex items-center justify-center shadow-[0_0_16px_rgba(30,63,216,0.35)]">
                  <div className="h-4 w-4 rounded-full bg-zinc-950 border border-[#38bdf8]/40 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                  </div>
                </div>
                <h3
                  className="hidden md:block text-xl md:pl-20 md:text-3xl lg:text-4xl font-google-sans-flex font-extrabold text-zinc-400 tracking-tight transition-colors duration-300 hover:text-[#f6f8ff]"
                  style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
                >
                  {item.title}
                </h3>
              </div>

              <div className="relative pl-16 sm:pl-20 pr-0 md:pl-4 md:pr-0 w-full">
                <h3
                  className="md:hidden block text-xl font-google-sans-flex font-extrabold mb-4 text-left text-zinc-300"
                  style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
                >
                  {item.title}
                </h3>
                {item.content}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-blue-950/40 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] pointer-events-none"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#1e3fd8] via-[#38bdf8] to-[#f6f8ff] from-[0%] via-[20%] to-[98%] rounded-full shadow-[0_0_12px_rgba(56,189,248,0.7)]"
          />
        </div>
      </div>
    </div>
  );
};
