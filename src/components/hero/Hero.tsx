"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MoveDown, Linkedin, Github, Mail } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import RollingButton from "../RollingButton";
import HeroTechStack from "./HeroTechStack";
import RollingText from "../RollingText";
import MagneticButton from "../MagneticButton";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const onClickWorks = () => {
    const element = document.getElementById("projects");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
    const onClickResume =()=>{
    window.open("#", "_blank");
    }

  return (
    <section
      id="hero"
      className="relative items-center w-full h-screen flex flex-col justify-center px-4 overflow-hidden pb-17 "
    >
      <motion.div
        style={{ y }}
        className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left Content */}
        <div className="flex flex-col items-start lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest uppercase"
          >
            Available for work
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            className="font-serif text-5xl md:text-7xl text-white/40"
            style={{ fontStyle: "italic" }}
          >
            Hello, It's
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 18,
              delay: 0.2,
            }}
            className="relative bg-clip-text text-transparent bg-linear-to-r from-white via-white/60 to-white/30 font-syne font-bold text-7xl md:font-extrabold  md:text-8xl tracking-tight mt-2"
          >
            {PORTFOLIO_DATA.name.toUpperCase()} <br />
            <span className="text-sm font-syne font-bold tracking-wider text-cyan-500 absolute -bottom-2 right-0 z-9999">
              {"Debpratim Sharma".toUpperCase()}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 18,
              delay: 0.4,
            }}
            className="mt-6 max-w-md text-white/70 text-xl font-syne"
          >
            Full-Stack Web Developer building intelligent, scalable digital
            products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 18,
              delay: 0.6,
            }}
            className="w-full flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-start sm:items-center justify-start sm:justify-evenly md:justify-start gap-4 mt-10"
          >
            <RollingButton text="See works" className="bg-white px-8 py-5" onClick={onClickWorks}>
              <ArrowUpRight size={18} />
            </RollingButton>

            <RollingButton
              text="Download Resume"
              className="bg-cyan-500/5 px-8 py-5"
              textColor="text-white"
              onClick={onClickResume}
            >
              <MoveDown size={16} />
            </RollingButton>
          </motion.div>
        </div>

        {/* Right Visual */}
        <div className="hidden lg:flex justify-center items-center min-h-125">
          <HeroTechStack />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 0.7 }}
        transition={{
          type: "spring",
          stiffness: 420, // higher = faster snap
          damping: 18, // lower = more overshoot
          mass: 0.7, // lower = quicker response
        }}
        className="w-full  absolute top-10 right-0 md:justify-end px-10 flex items-center justify-center gap-10 "
      >
        <MagneticButton href="https://www.linkedin.com/in/debpratim-sharma-916203267/">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl">
            <Linkedin />
          </div>
        </MagneticButton>
        <MagneticButton href="https://github.com/DebpratimSharma">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl">
            <Github />
          </div>
        </MagneticButton>
        <MagneticButton href="">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl">
            <Mail />
          </div>
        </MagneticButton>
      </motion.div>
    </section>
  );
}
