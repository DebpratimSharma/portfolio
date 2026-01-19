"use client";

import {motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MoveDown } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import RollingButton from "../RollingButton";
import HeroTechStack from "./HeroTechStack";

export default function Hero() {
    const {scrollY} = useScroll();
    const y = useTransform(scrollY, [0,500],[0,150]);
    return(
        <section id="hero" className="relative min-h-screen w-full flex flex-col justify-center px-4 overflow-hidden">
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

          <h2 className="font-serif text-5xl md:text-7xl text-white/80" style={{ fontStyle: 'italic' }}>
            Hello, It's
          </h2>

          <h1 className="relative font-syne font-bold text-7xl md:font-extrabold  md:text-8xl tracking-tight text-white mt-2">
            {PORTFOLIO_DATA.name.toUpperCase()} <br/>
            <span className="text-sm font-syne font-bold tracking-wider text-cyan-500 absolute -bottom-2 right-0 z-9999">{"Debpratim Sharma".toUpperCase()}</span>
          </h1>

          <p className="mt-6 max-w-md text-white/70 text-xl font-syne">
            Full-Stack Web Developer building intelligent, scalable digital products.
            
          </p>

          <div className="w-full flex items-center justify-evenly md:justify-start gap-4 mt-10">
            <RollingButton text="See works">
                <ArrowUpRight size={18} />
            </RollingButton>
            <a
              href={PORTFOLIO_DATA.resumeUrl}
              download
              className="px-8 py-3 border border-white/20 rounded-full text-white font-bold flex items-center gap-2 hover:bg-cyan-900/50 transition-all duration-300"
            >
              Resume <MoveDown size={16} />
            </a>
            
          </div>
        </div>

        {/* Right Visual */}
        <div className="hidden lg:flex justify-center items-center min-h-125">
          <HeroTechStack />
        </div>
      </motion.div>

        </section>
    )
}