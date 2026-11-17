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
        this whole layer is pulled upward, dramatically unveiling the stationary Footer underneath.
      */}
      <div className="relative z-10 w-full bg-black shadow-[0_40px_80px_-15px_rgba(0,0,0,1)] border-b border-white/10">
        <Hero />
        <SelectedWorks />
        <Experience />
        <WhatIDo />
        <Contact />

        {/* Shutter bottom edge / lift indicator */}
        <div className="w-full bg-gradient-to-b from-black to-zinc-950 py-3.5 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-widest border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>CONTACT ME // SCROLL TO LIFT SHUTTER</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="hidden sm:inline text-[10px] text-zinc-500">PULL UP</span>
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Revealed Footer */}
      <Footer />
    </main>
  );
}
