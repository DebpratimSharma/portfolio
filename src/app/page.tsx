"use client";
import Hero from "@/components/hero/Hero";
import Image from "next/image";
import BackgroundGlow from "@/components/BackgroundGlow";
import { useState, useEffect } from "react";
import Dock from "@/components/Dock";
import Works from "@/components/works/Works";
import About from "@/components/about/About";
import Experiece from "@/components/experience/Experiece";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  useEffect(() => {
    const handleScroll = () => {
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
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      <BackgroundGlow />
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
