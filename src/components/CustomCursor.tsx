"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const spring = { stiffness: 500, damping: 35, mass: 0.15 };
  const cursorX = useSpring(x, spring);
  const cursorY = useSpring(y, spring);

  useEffect(() => {
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      !window.matchMedia("(pointer: fine)").matches;

    if (isTouch) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as Element;
      setHovering(
        !!target.closest("a, button, [role='button'], [data-cursor='hover']")
      );
    };

    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Core dot */}
      <motion.div
        className="fixed top-0 left-0 z-9999 pointer-events-none mix-blend-difference"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-9998 pointer-events-none mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 64 : 28,
          height: hovering ? 64 : 28,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="w-full h-full rounded-full border border-white/80" />
      </motion.div>
    </>
  );
}
