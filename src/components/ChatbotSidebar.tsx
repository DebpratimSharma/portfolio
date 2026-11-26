"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import CrystalizedBall, { CrystalizedBallPreset } from "@/components/CrystalizedBall";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const LazyChatPanel = dynamic(() => import("@/components/chat/ChatPanel"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center p-6 text-xs font-syne text-white/50 bg-black">
      Loading...
    </div>
  ),
});

export interface ChatbotSidebarProps {
  /**
   * Whether the AI chatbot trigger and sidebar are enabled.
   * When false, the component renders nothing and all AI chatbot frontend elements stay invisible.
   * Defaults to PORTFOLIO_DATA.features?.enableAceChatbot (false).
   */
  enabled?: boolean;
  /**
   * Children slot where the chatbot interface component will be plugged in.
   * Kept empty by default until provided.
   */
  children?: React.ReactNode;
  /**
   * Preset style for the CrystalizedBall.
   * Options: 'plasma' | 'aurora' | 'nebula' | 'ember' | 'frost' | 'solar' | 'eclipse' | 'abyss'
   */
  preset?: CrystalizedBallPreset;
  /**
   * Custom hex or rgb color override for the CrystalizedBall.
   */
  ballColor?: string;
  /**
   * Sidebar title displayed in the header.
   */
  title?: string;
  /**
   * Optional custom className for the floating trigger button container.
   */
  className?: string;
}

export default function ChatbotSidebar({
  enabled = PORTFOLIO_DATA.features?.enableAceChatbot ?? false,
  children,
  preset = "abyss",
  ballColor,
  title = "ACE Assistant",
  className = "",
}: ChatbotSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInFooter, setIsInFooter] = useState(false);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isEnabled = enabled;

  const closeSidebar = () => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      launcherRef.current?.focus();
    });
  };

  // Monitor when the footer is reached so the floating trigger smoothly disappears
  useEffect(() => {
    if (!isEnabled) return;
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const footer = document.getElementById("footer");
      if (!footer) return false;

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsInFooter(entry.isIntersecting);
        },
        {
          threshold: 0.05,
        }
      );

      observer.observe(footer);
      return true;
    };

    if (!setupObserver()) {
      const interval = setInterval(() => {
        if (setupObserver()) {
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    }

    return () => {
      observer?.disconnect();
    };
  }, [isEnabled]);

  // Listen for open-chatbot custom events from navbar or other triggers
  useEffect(() => {
    if (!isEnabled) return;
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, [isEnabled]);

  // Close sidebar on Escape key press
  useEffect(() => {
    if (!isEnabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        requestAnimationFrame(() => {
          launcherRef.current?.focus();
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEnabled, isOpen]);

  // Keep all AI chatbot elements invisible when disabled
  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Floating CrystalizedBall Trigger in the Bottom Right Corner (hidden on mobile and in footer) */}
      <div
        className={cn(
          "hidden sm:flex fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 items-center justify-center select-none transition-all duration-300 ease-in-out",
          isInFooter
            ? "opacity-0 scale-75 pointer-events-none translate-y-6"
            : "opacity-100 scale-100 pointer-events-auto translate-y-0",
          className
        )}
      >
        <button
          ref={launcherRef}
          type="button"
          onClick={() => (isOpen ? closeSidebar() : setIsOpen(true))}
          className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center p-1 bg-transparent hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {/* Tooltip on hover */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-black text-white font-syne text-xs font-medium tracking-wide whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            {isOpen ? "Close" : "Ask ACE"}
          </div>

          {/* Interactive CrystalizedBall Component */}
          <div className="w-full h-full rounded-full overflow-hidden">
            <CrystalizedBall
              preset={preset}
              color={ballColor}
              strands={1}
              particleCount={1000}
              size={0.88}
              interactive={true}
              hoverStrength={0.85}
            />
          </div>
        </button>
      </div>

      {/* Sidebar Overlay and Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-50 bg-black/80"
              aria-hidden="true"
            />

            {/* Sidebar drawer */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={prefersReducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", damping: 30, stiffness: 300 }
              }
              className="fixed top-0 left-0 right-0 h-dvh max-h-dvh pt-[env(safe-area-inset-top)] pb-[calc(4rem+env(safe-area-inset-bottom))] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:max-h-none sm:pt-0 sm:pb-0 z-50 w-full sm:w-[440px] md:w-[480px] bg-black font-syne flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="font-syne text-base font-semibold text-white tracking-wide">
                  {title}
                </h2>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chatbot Interface Slot */}
              <div className="flex-1 min-h-0 flex flex-col bg-black">
                {children ? children : <LazyChatPanel />}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
