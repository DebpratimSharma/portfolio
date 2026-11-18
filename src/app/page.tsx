import Hero from "@/components/sections/Hero";
import SelectedWorks from "@/components/sections/SelectedWorks";
import Experience from "@/components/sections/Experience";
import WhatIDo from "@/components/sections/WhatIDo";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-black text-white select-none">
      {/* 
        The Shutter Layer:
        The entire project covers the fixed footer like an opaque shutter.
        As the user reaches and scrolls past the Contact Me section, 
        this whole layer is pulled upward, stopping so that the bottom of the Contact section
        remains visible at the top 15% of the screen as a shutter.
      */}
      <div className="relative z-10 w-full bg-black shadow-[0_40px_80px_-15px_rgba(0,0,0,1)] border-b border-white/10">
        <Hero />
        <SelectedWorks />
        <Experience />
        <WhatIDo />
        <Contact />

        {/* Shutter bottom edge / handle bar visible at top 15% */}
        {/* <div className="w-full bg-gradient-to-b from-zinc-950 to-black py-4 px-6 sm:px-10 flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-widest border-t border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-semibold">05 // CONTACT ME</span>
            <span className="text-zinc-600 hidden sm:inline">— SHUTTER PULLED UP</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-400">
            <span className="text-[10px] text-zinc-500 hidden sm:inline">PULL DOWN TO CLOSE</span>
            <div className="w-12 h-1.5 rounded-full bg-zinc-700/80 border border-white/10" />
          </div>
        </div> */}
      </div>

      {/* Revealed Footer */}
      <Footer />
    </main>
  );
}
