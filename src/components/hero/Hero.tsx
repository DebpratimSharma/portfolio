"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MoveDown } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import RollingButton from "../RollingButton";
import ColorBends from "../ColorBends";
import RollingText from "../RollingText";
import MagneticButton from "../MagneticButton";
import DotField from "../DotField";
import ScrollVelocity from "../ScrollVelocity";
import Navbar from "../Navbar";


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
      className="relative w-full h-screen flex flex-col justify-center items-center px-4 overflow-hidden outline-2 outline-white/10 mb-10"
    >
      {/* Animated Background Elements */}

      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-0 pointer-events-none ">
          <ColorBends
            colors={['#08414aff', '#0e4f5fff', '#083d4cff']}
            speed={0.5}
            frequency={0.8}
            noise={0.15}

            rotation={70}
            iterations={0}
            intensity={1.0}
            className="absolute inset-0 hidden md:block"
          />
        </motion.div>

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

      {/* Main Content - Centre Aligned */}
      <motion.div

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
            className="bg-white py-4 px-8 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            onClick={onClickWorks}
          >
            <ArrowUpRight size={18} />
          </RollingButton>

          <RollingButton
            text="Download Resume"
            className="bg-cyan-500/5 py-4 px-8 border border-cyan-500/30"
            textColor="text-white"
            onClick={onClickResume}
          >
            <MoveDown size={16} />
          </RollingButton>
        </motion.div>
      </motion.div>

      {/* Top Navbar */}
      

      {/* Scroll Velocity - Skills */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none pb-6 overflow-hidden">
        <ScrollVelocity
          texts={[
            PORTFOLIO_DATA.stack.map((s) => s.name).join("  .  ") + "  .  ",
            PORTFOLIO_DATA.stack.map((s) => s.name).reverse().join("  .  ") + "  .  "
          ]}
          velocity={50}
          className="text-white/20 font-syne text-xl md:text-3xl"
          scrollerClassName="!leading-none"
        />
      </div>
    </section>
  );
}
