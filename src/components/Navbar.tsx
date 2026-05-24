"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import MagneticButton from "./MagneticButton";


export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 py-6 left-0 w-full px-6 md:px-12 flex items-center justify-between z-50 pointer-events-none bg-linear-to-b from-black to-transparent">
      <Link href="#hero" className={`font-syne font-bold text-xl md:text-2xl tracking-wider text-white drop-shadow-md cursor-default pointer-events-auto transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        {PORTFOLIO_DATA.title.toUpperCase()}
      </Link>

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
    </header>
  );
}
