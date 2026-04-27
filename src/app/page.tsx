"use client";
import Hero from "@/components/hero/Hero";
import Image from "next/image";
import BackgroundGlow from "@/components/BackgroundGlow";
import { useState, useEffect, useRef, useCallback } from "react";
import Dock from "@/components/Dock";
import Works from "@/components/works/Works";
import About from "@/components/about/About";
import Experiece from "@/components/experience/Experiece";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/Footer";
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Debpratim Sharma',
  jobTitle: 'Full Stack Developer',
  url: 'https://debprix.vercel.app',
  sameAs: [
    'https://github.com/DebpratimSharma',
    'https://www.linkedin.com/in/debpratim-sharma-916203267/'
  ]
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    // Throttle scroll handler to fire at most once per ~100ms (rAF-based)
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const sections = ["hero", "projects", "about", "experience", "contact", "footer"];
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (
            element &&
            element.offsetTop <= scrollPosition &&
            element.offsetTop + element.offsetHeight >= scrollPosition
          ) {
            setActiveSection(section);
            break; // Exit on first match — no need to keep checking
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* <div
        className={`pointer-events-none transition-opacity duration-500 ${
          activeSection === "hero" ? "opacity-0" : "opacity-100"
        }`}
      > */}
        <BackgroundGlow />
      {/* </div> */}
      <main>
        <Hero />
        <div className="max-w-6xl flex flex-col gap-y-12 mx-auto px-4">
          <Works />
          <About />
          <Experiece />
          <Contact />
        </div>
      </main>
      <Footer />
      <Dock currentSection={activeSection} />
    </div>
  );
}
