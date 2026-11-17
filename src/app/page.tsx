import Hero from "@/components/sections/Hero";
import SelectedWorks from "@/components/sections/SelectedWorks";
import Experience from "@/components/sections/Experience";
import WhatIDo from "@/components/sections/WhatIDo";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="w-full bg-black text-white select-none">
      <Hero />
      <SelectedWorks />
      <Experience />
      <WhatIDo />
      <Contact />
      <Footer />
    </main>
  );
}
