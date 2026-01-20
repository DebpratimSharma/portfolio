"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { ReactNode, useRef } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  href,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 170, damping: 32, mass: 0.5 });
  const mouseY = useSpring(y, { stiffness: 170, damping: 32, mass: 0.5 });
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (!canHover ||!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const factor = 2;
    x.set((e.clientX - (left + width / 2)) * factor);
    y.set((e.clientY - (top + height / 2)) * factor);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        style={{ x: mouseX, y: mouseY }}
        className={`relative flex items-center justify-center cursor-pointer ${className}`}
      >
        {children}
      </motion.div>
    </a>
  );
};

export default MagneticButton;
