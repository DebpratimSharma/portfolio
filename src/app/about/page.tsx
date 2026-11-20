import type { Metadata } from "next";
import AboutView from "@/components/sections/AboutView";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Debpratim Sharma (Debprix) – Full-Stack Web Developer & Gen AI Engineer. Discover his systems-first engineering philosophy, technical background, and stack.",
};

export default function AboutPage() {
  return (
    <main className="relative w-full bg-black text-white select-none">
      {/* 
        The Shutter Layer:
        The content layer covers the fixed footer like an opaque shutter.
        As the user reaches the end of the page, this whole layer is pulled upward,
        revealing the fixed footer seamlessly.
      */}
      <div className="relative z-10 w-full bg-black shadow-[0_40px_80px_-15px_rgba(0,0,0,1)] border-b border-white/10">
        <AboutView />
      </div>

      {/* Revealed Footer */}
      <Footer />
    </main>
  );
}
