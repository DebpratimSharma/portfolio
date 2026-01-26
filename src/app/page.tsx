"use client";
import Hero from "@/components/hero/Hero";
import Image from "next/image";
import BackgroundGlow from "@/components/BackgroundGlow";
import { useState, useEffect } from "react";
import Dock from "@/components/Dock";
import Works from "@/components/works/Works";
import About from "@/components/about/About";
import Experiece from "@/components/experience/Experiece";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "projects", "about", "experience", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          element.offsetTop <= scrollPosition &&
          element.offsetTop + element.offsetHeight >= scrollPosition
        ) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden pb-40">
      <BackgroundGlow />
      <main className="relative space-y-20">
        <Hero />
        <Works />
        <About />
        <Experiece />
      </main>
      <Dock currentSection={activeSection} />
    </div>
  );
}
