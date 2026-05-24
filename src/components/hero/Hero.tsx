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

  const { scrollY } = useScroll();
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
      className="relative w-full h-screen px-4 overflow-hidden outline-2 outline-white/10 mb-10"
    >
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
      <div className="h-full relative w-full flex flex-col justify-between z-10 px-8 py-10">
        <div className="topsection max-w-3xl flex flex-col items-start gap-4 mt-10 md:mt-0">
          <h2 className="font-syne italic text-lg sm:text-xl">Welcome to</h2>
          <h1 className="font-syne font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl pb-6">
            {PORTFOLIO_DATA.title.toUpperCase()}
          </h1>
          <p className="max-w-xl text-lg leading-7">
            A space built from late-night ideas, prototypes, hackathons, and
            endless curiosity. Here you'll find AI systems, IoT innovations,
            modern web applications, and experiments designed to push beyond
            ordinary engineering.
          </p>
        </div>
        <div className="bottomsection flex flex-col gap-6 md:flex-row md:justify-between w-full mb-30 md:mb-0">
          <div className="leftSection max-w-2xl">
            <div className="buttons-container flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-start">
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
            <h1 className="text-lg sm:text-xl md:text-xl lg:text-3xl font-bold text-white/80 mt-4">
              AI . IoT . Web . Backend Developer 
            </h1>
          </div>
          <div className="rightSection max-w-2xl w-full">
            <h1 className="font-zen-dots text-cyan-500 font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-right">
              {PORTFOLIO_DATA.name}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
