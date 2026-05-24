"use client";
import { useState } from "react";
import { LayoutGroup, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MoveDown } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import RollingButton from "../RollingButton";
import ColorBends from "../ColorBends";

import DotField from "../DotField";

import { useDevicePerformance } from "@/lib/useDevicePerformance";
import RotatingText from "../RotatingText";

export default function Hero() {
  const [textIdx, setTextIdx] = useState(0);

  const layoutTransition = {
    type: "spring" as const,
    stiffness: 140,
    damping: 22,
    mass: 0.5,
  };

  const { scrollY, scrollYProgress } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const { shouldReduceAnimations, shouldSkipGPUEffects, isMobile } =
    useDevicePerformance();

  const onClickWorks = () => {
    const element = document.getElementById("projects");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  const onClickResume = () => {
    window.open(PORTFOLIO_DATA.resumeUrl, "_blank");
  };

  // Simplified entrance animation for low-end/mobile
  const entranceTransition = shouldReduceAnimations
    ? { duration: 0.3, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 420, damping: 18 };

  return (
    <section
      id="hero"
      className="relative w-full h-screen px-4 overflow-hidden border-b border-white/10 mb-10"
    >
      <div className="absolute top-20 right-6 z-20 hidden md:flex items-center">
        <div className="flex flex-col items-center justify-center gap-4 p-8 h-64">
          {/* Track Line Container */}
          <div className="relative w-0.75 h-24 bg-neutral-800 overflow-hidden rounded-full">
            {/* Animated Active Line */}
            <motion.div
              className="absolute top-0 left-0 right-0 bg-cyan-500 origin-top"
              initial={{ height: "0%" }}
              animate={{
                height: ["0%", "100%", "100%"],
                y: ["0%", "0%", "100%"],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>

          {/* Vertical Text */}
          <span
            className="text-xs font-semibold tracking-[0.25em] text-neutral-400 select-none"
            style={{ writingMode: "vertical-lr" }}
          >
            SCROLL
          </span>
        </div>
      </div>

      {/* Animated Background Elements */}

      <div className="absolute inset-0 overflow-hidden">
        {/* ColorBends: already hides itself on mobile via className + internal performance check */}
        <div className="absolute inset-0 pointer-events-none ">
          <ColorBends
            colors={["#08414aff", "#0e4f5fff", "#083d4cff"]}
            speed={0.5}
            frequency={1.7}
            noise={0}
            rotation={70}
            iterations={0}
            intensity={1.0}
            className="absolute inset-0 hidden md:block"
          />
        </div>

        {/* DotField: internally handles performance degradation */}
        <div className="absolute inset-0">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
          />
        </div>
      </div>

      {/* Main Content - Full Screen */}
      <div className="h-full relative w-full flex flex-col justify-between gap-3 z-10 px-4 md:px-10 py-10 ">
        <div className="topsection max-w-3xl flex flex-col items-start gap-4 mt-5 md:mt-8">
          <h2 className="font-syne pl-1 italic text-lg sm:text-2xl">
            Welcome to
          </h2>
          <h1 className="font-syne font-extrabold leading-[1.2] md:leading-15 text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] ">
            {PORTFOLIO_DATA.title.toUpperCase()}
          </h1>
          <p className="max-w-xl md:pt-10 pl-1 text-lg leading-7 text-white/50">
            This is my World. A place where I share my projects, ideas, and
            passions. Dive in to explore the fusion of creativity and technology
            that defines who I am.
          </p>
        </div>
        <div className="bottomsection relative flex flex-col gap-6 md:flex-row md:justify-between w-full mb-28 md:mb-0">
          <div className="absolute -top-10 right-0 hidden md:flex flex-col items-end gap-4 md:flex-row">
            <div className="px-3 py-1 glass-panel rounded-full text-sm">
               {PORTFOLIO_DATA.location}
            </div>
            <div className="px-3 py-1 glass-panel rounded-full text-sm text-green-300 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Available for work
            </div>
          </div>
          <div className="leftSection max-w-2xl">
            <div className="buttons-container flex items-start gap-4 sm:flex-row sm:flex-wrap sm:items-start">
              <RollingButton
                onClick={onClickWorks}
                text="Projects"
                textColor="text-black"
                className="px-5 bg-white py-4 w-full sm:w-max h-auto self-start"
              >
                <ArrowUpRight size={18} />
              </RollingButton>
              <RollingButton
                onClick={onClickResume}
                text="Resume"
                textColor="text-white"
                className="px-5 py-4 w-full sm:w-max h-auto self-start"
              >
                <MoveDown size={18} />
              </RollingButton>
            </div>
            <h1 className="text-lg text-center md:text-left sm:text-xl md:text-xl lg:text-3xl font-bold text-white/70 mt-4">
              Gen AI . React . Design . Blockchain 
            </h1>
            <h2 className="text-white/60 text-center md:text-left">Full-Stack Developer</h2>
          </div>
          
          <div className="rightSection  max-w-2xl w-full">
            
            <h1 className="font-zen-dots text-cyan-500 font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl md:text-right text-center">
              {PORTFOLIO_DATA.name}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
