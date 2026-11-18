"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import CrystalizedBall, { CrystalizedBallPreset } from "@/components/CrystalizedBall";
import { cn } from "@/lib/utils";

export interface ChatbotSidebarProps {
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
  children,
  preset = "abyss",
  ballColor,
  title = "ACE Assistant",
  className = "",
}: ChatbotSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInFooter, setIsInFooter] = useState(false);

  // Monitor when the footer is reached so the floating trigger smoothly disappears
  useEffect(() => {
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
  }, []);

  // Listen for open-chatbot custom events from navbar or other triggers
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating CrystalizedBall Trigger in the Bottom Right Corner (hidden in footer) */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center justify-center select-none transition-all duration-300 ease-in-out",
          isInFooter
            ? "opacity-0 scale-75 pointer-events-none translate-y-6"
            : "opacity-100 scale-100 pointer-events-auto translate-y-0",
          className
        )}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center p-1 bg-transparent hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {/* Tooltip on hover */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-neutral-900/95 text-white text-xs font-medium tracking-wide whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none border border-white/10 shadow-lg backdrop-blur-md">
            {isOpen ? "Close assistant" : "Chat with AI"}
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
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Sidebar drawer */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] md:w-[480px] max-w-[95vw] bg-neutral-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <h2 className="font-syne text-base font-semibold text-white tracking-wide">
                        {title}
                      </h2>
                    </div>
                    <span className="text-xs text-neutral-400">Online</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chatbot Interface Slot (Empty for now) */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                {children ? (
                  children
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl m-2">
                    <p className="text-neutral-500 text-sm font-mono">
                      Chatbot interface will appear here
                    </p>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
