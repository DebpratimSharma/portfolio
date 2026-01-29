"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  motionValue,
  useSpring,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

interface CrystalCardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  disableSpring?: boolean;
}

const CrystalCard: React.FC<CrystalCardProps> = ({
  children,
  className = "",
  onClick,
  disableSpring = false,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)and (pointer: coarse)");
    setIsTouchDevice(mq.matches);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  //magnetic motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  //spotlight motion
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  //trigger physics for a premium feel
  const springConfig = { stiffness: 370, damping: 20, mass: 0.8 };
  const mouseX = disableSpring ? x : useSpring(x, springConfig);
  const mouseY = disableSpring ? y : useSpring(y, springConfig);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isTouchDevice) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    ref.current.getBoundingClientRect();

    //magnetic pull only if not disabled
    if (!disableSpring) {
      const xPos = clientX - (left + width / 2);
      const yPos = clientY - (top + height / 2);
      x.set(xPos / 50);
      y.set(yPos / 50);
    }

    //spotlight position always
    spotX.set(clientX - left);
    spotY.set(clientY - top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  //gradient

  const background = useMotionTemplate`radial-gradient(
        650px circle at ${spotX}px ${spotY}px, 
        rgba(255, 255, 255, 0.2),
        transparent 40%
    )`;

  const border = useMotionTemplate`
        radial-gradient(
          400px circle at ${spotX}px ${spotY}px,
          rgba(255, 255, 255, 0.3),
          transparent 40%
        )
    `;

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={
        isTouchDevice
          ? undefined
          : (e) => {
              setHovered(true);
              handleMouseMove(e);
            }
      }
      onMouseLeave={() => {
        setHovered(false);
        handleMouseLeave();
      }}
      style={
        isTouchDevice || disableSpring ? undefined : { x: mouseX, y: mouseY }
      }
      whileHover={isTouchDevice || disableSpring ? undefined : { scale: 1.01 }}
      transition={
        isTouchDevice || disableSpring
          ? undefined
          : { type: "spring", ...springConfig }
      }
      className={`group relative rounded-4xl overflow-hidden border border-white/15 bg-white/5 shadow-2xl ${className}`}
    >
      {/*spotlight */}
      {!isTouchDevice && hovered && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/*border highlight curretly disabled for performance reasons 
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: border,
            maskImage: "linear-gradient(#fff, #fff)",
            maskComposite: "exclude",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              padding: "1px",
          }}
        />*/}

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

export default CrystalCard;
