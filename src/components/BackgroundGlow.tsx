"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { div } from "framer-motion/client";

const BackgroundGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  //bg-gradient

  const background = useMotionTemplate`radial-gradient(900px circle at ${mouseX}px ${mouseY}px, rgba(34, 211, 238, 0.15), transparent 65%)`;

  useEffect(() => {
    // disable for mobile devices
    const checkDevice = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      setIsMobile(isTouch || !hasFinePointer);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkDevice);
    };
  }, [mouseX, mouseY, isMobile]);

  if (isMobile)
    return (
        <div className="fixed inset-0 w-full h-screen bg-linear-to-tl from-cyan-500/15 via-cyan-500/5 to-transparent pointer-events-none mix-blend-screen"/>
    );

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none mix-blend-screen"
      style={{ background }}
    />
  );
};
export default BackgroundGlow;
