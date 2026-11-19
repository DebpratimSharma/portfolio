"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import { AnimatedNavLink } from "@/components/ui/animated-nav-link";
import { ShinyButton } from "@/components/ui/shiny-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  logoText?: string;
  logoHref?: string;
  logoIconSrc?: string;
  navItems?: NavItem[];
  aboutHref?: string;
  aboutText?: string;
  askAceText?: string;
  enableAskAce?: boolean;
  className?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "What I Do", href: "#what-i-do" },
];

export default function Navbar({
  logoText = "Debprix",
  logoHref = "#",
  logoIconSrc = "/navbar-icon.png",
  navItems = defaultNavItems,
  aboutHref = "#hero",
  aboutText = "About me",
  askAceText = "Ask ACE",
  enableAskAce = PORTFOLIO_DATA.features?.enableAceChatbot ?? false,
  className = "",
}: NavbarProps) {
  const [isAskAceEnabled, setIsAskAceEnabled] = useState(enableAskAce);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoHoverKey, setLogoHoverKey] = useState(0);
  const [aceHoverKey, setAceHoverKey] = useState(0);
  const [mobileAceHoverKey, setMobileAceHoverKey] = useState(0);

  useEffect(() => {
    setIsAskAceEnabled(enableAskAce);
  }, [enableAskAce]);

  const handleOpenAce = () => {
    if (!isAskAceEnabled) return;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-chatbot"));
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full pt-[env(safe-area-inset-top)] pb-5 select-none bg-gradient-to-b from-black/30 to-transparent transition-all duration-300 font-syne font-semibold",
        className
      )}
    >
      {/* Gradual progressive blur (high blur at top -> zero blur at bottom) & gradient tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
      >
        {/* Primary progressive blur layer */}
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

        {/* Secondary feathered top blur for silk-smooth falloff */}
        <div
          className="absolute inset-0 backdrop-blur-2xl"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <nav
          aria-label="Main Navigation"
          className="h-16 sm:h-[68px] flex items-center justify-between"
        >
          {/* LEFT: Logo Anchor with custom DS emblem */}
          <div className="flex items-center">
            <a
              href={logoHref}
              onMouseEnter={() => setLogoHoverKey((prev) => prev + 1)}
              className="group flex items-center gap-3 text-white tracking-[-0.01em] cursor-pointer"
              aria-label={logoText}
            >
              {/* Custom DS Icon Image */}
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden drop-shadow-[0_0_12px_rgba(85,187,251,0.5)]">
                <Image
                  src={logoIconSrc}
                  alt="Debprix logo icon"
                  width={44}
                  height={44}
                  priority
                  className="w-full h-full object-contain "
                />
              </div>
              <h1 className="font-syne font-bold text-[18px]">DEBPRIX</h1>
            </a>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => (
              <AnimatedNavLink
                key={item.label}
                href={item.href}
                animation="blurInUp"
                by="character"
                duration={0.25}
                className="text-[18px] font-normal text-white tracking-wide py-1"
              >
                {item.label}
              </AnimatedNavLink>
            ))}
          </div>

          {/* RIGHT: Action Links / Buttons */}
          <div className="hidden sm:flex items-center gap-3.5 lg:gap-4">
            {/* About me secondary button using InteractiveHoverButton */}
            <InteractiveHoverButton
              href={aboutHref}
              className="!py-1.5 sm:!py-2 !px-4 sm:!px-5 !text-[12px] min-w-[120px]"
            >
              {aboutText}
            </InteractiveHoverButton>

            {/* Ask ACE button using ShinyButton */}
            {isAskAceEnabled && (
              <div
                onMouseEnter={() => setAceHoverKey((prev) => prev + 1)}
                className="inline-flex items-center"
              >
                <ShinyButton
                  onClick={handleOpenAce}
                  className="!py-1.5 sm:!py-2 !px-4 sm:!px-5 !text-[12px] !font-semibold transition-all active:scale-95 cursor-pointer shadow-[0_0_16px_rgba(132,132,255,0.25)] hover:shadow-[0_0_24px_rgba(132,132,255,0.45)]"
                >
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkle preview-icon"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>{askAceText}
                  </div>
                </ShinyButton>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE (Mobile screens) */}
          <div className="flex sm:hidden items-center gap-2">
            {isAskAceEnabled && (
              <div
                onMouseEnter={() => setMobileAceHoverKey((prev) => prev + 1)}
                className="inline-flex"
              >
                <ShinyButton
                  onClick={handleOpenAce}
                  className="!py-1.5 !px-3.5 !text-[18px] !font-semibold"
                >
                  <TextAnimate
                    key={mobileAceHoverKey}
                    animation="blurInUp"
                    by="character"
                    duration={0.25}
                    as="span"
                    startOnView={false}
                  >
                    {askAceText}
                  </TextAnimate>
                </ShinyButton>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mb-4 p-5 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-2xl flex flex-col gap-3.5"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <AnimatedNavLink
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    animation="blurInUp"
                    by="character"
                    duration={0.25}
                    className="text-[18px] font-medium text-white/80 hover:text-white px-2 py-1.5 transition-colors"
                  >
                    {item.label}
                  </AnimatedNavLink>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                <InteractiveHoverButton
                  href={aboutHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-center !py-2.5 !text-[18px]"
                >
                  {aboutText}
                </InteractiveHoverButton>

                {isAskAceEnabled && (
                  <div
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleOpenAce();
                    }}
                    className="w-full flex justify-center"
                  >
                    <ShinyButton className="w-full !py-2.5 !text-[18px] !font-semibold">
                      {askAceText}
                    </ShinyButton>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
