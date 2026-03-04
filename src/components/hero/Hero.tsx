"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MoveDown, Linkedin, Github, Mail } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import RollingButton from "../RollingButton";
import HeroTechStack from "./HeroTechStack";
import RollingText from "../RollingText";
import MagneticButton from "../MagneticButton";
import LightRays from "../LightRays";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const onClickWorks = () => {
    const element = document.getElementById("projects");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  const onClickResume = () => {
    window.open(PORTFOLIO_DATA.resumeUrl, "_blank");
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col justify-center items-center px-4 overflow-hidden"
    >
      {/* Animated Background Elements */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Center Animated Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />

        {/* Animated Grid Background */}
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />

        {/* Light Rays Background */}
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      {/* Main Content - Centre Aligned */}
      <motion.div
        style={{ y }}
        className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-10"
      >
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest uppercase backdrop-blur-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
        >
          Available for work
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="font-serif text-xl sm:text-2xl text-white/50 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"
          style={{ fontStyle: "italic" }}
        >
          Welcome to
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 18,
            delay: 0.2,
          }}
          className="relative z-10 bg-clip-text text-transparent bg-linear-to-r from-white via-white/60 to-white/30 font-syne font-bold text-6xl sm:text-7xl md:text-8xl tracking-tight mt-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        >
          {PORTFOLIO_DATA.title.toUpperCase()}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 18,
            delay: 0.3,
          }}
          className="text-sm font-syne font-bold tracking-wider text-cyan-500 mt-4 drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]"
        >
          {"Debpratim Sharma".toUpperCase()}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 18,
            delay: 0.4,
          }}
          className="mt-8 max-w-2xl text-white/70 text-lg sm:text-xl font-syne drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
        >
          Full-Stack Web Developer building intelligent, scalable digital
          products.
        </motion.p>

        {/* Tech Stack - Centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 18,
            delay: 0.5,
          }}
          className="my-12 w-full flex justify-center absolute -z-90"
        >
          <HeroTechStack />
        </motion.div>

        {/* CTA Buttons - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 18,
            delay: 0.6,
          }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-8"
        >
          <RollingButton
            text="See works"
            className="bg-white py-3 px-8 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            onClick={onClickWorks}
          >
            <ArrowUpRight size={18} />
          </RollingButton>

          <RollingButton
            text="Download Resume"
            className="bg-cyan-500/5 py-3 px-8 border border-cyan-500/30"
            textColor="text-white"
            onClick={onClickResume}
          >
            <MoveDown size={16} />
          </RollingButton>
        </motion.div>
      </motion.div>

      {/* Social Links - Top Center */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 0.7 }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 18,
          mass: 0.7,
        }}
        className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 z-20"
      >
        <MagneticButton href="https://www.linkedin.com/in/debpratim-sharma-916203267/">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl hover:bg-cyan-500/30 transition-colors">
            <Linkedin size={20} />
          </div>
        </MagneticButton>
        <MagneticButton href="https://github.com/DebpratimSharma">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl hover:bg-cyan-500/30 transition-colors">
            <Github size={20} />
          </div>
        </MagneticButton>
        <MagneticButton href="mailto:debpratimsharma33@gmail.com">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl hover:bg-cyan-500/30 transition-colors">
            <Mail size={20} />
          </div>
        </MagneticButton>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute bottom-40 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/50 uppercase tracking-widest">
            Scroll to explore
          </span>
          <MoveDown size={20} className="text-white/50" />
        </div>
      </motion.div>
    </section>
  );
}
