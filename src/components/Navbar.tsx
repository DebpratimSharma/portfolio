"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import MagneticButton from "./MagneticButton";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 18,
        mass: 0.7,
      }}
      className="fixed top-6 left-0 w-full px-6 md:px-12 flex items-center justify-between z-50 pointer-events-none"
    >
      <div className="font-syne font-bold text-xl md:text-2xl tracking-wider text-white drop-shadow-md cursor-default pointer-events-auto">
        {PORTFOLIO_DATA.title.toUpperCase()}
      </div>

      <div className="flex items-center gap-2 p-1.5 glass-panel rounded-full pointer-events-auto">
        {PORTFOLIO_DATA.socials.map((link, index) => {
          const Icon = link.icon;
          return (
            <MagneticButton key={index} href={link.href}>
              <div className="p-2.5 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors cursor-pointer" aria-label={link.label}>
                <Icon size={18} />
              </div>
            </MagneticButton>
          );
        })}
      </div>
    </motion.header>
  );
}
