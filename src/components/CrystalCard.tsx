"use client";

import React, { useRef } from "react";
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
}

const CrystalCard: React.FC<CrystalCardProps> = ({
  children,
  className = "",
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  //magnetic motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  //spotlight motion
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  //trigger physics for a premium feel
  const springConfig = { stiffness: 400, damping: 25, mass: 0.5 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    ref.current.getBoundingClientRect();

    //magnetic pull
    const xPos = clientX - (left + width / 2);
    const yPos = clientY - (top + height / 2);
    x.set(xPos / 20);
    y.set(yPos / 20);

    //spotlight position
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
        rgba(255, 255, 255, 0.015),
        transparent 60%
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
    ref={ref} onClick={onClick}
    onMouseMove = {handleMouseMove}
    onMouseLeave = {handleMouseLeave}
    style={{ x: mouseX, y: mouseY }}
    whileHover={{scale: 1.01}} transition={{type: "spring", ...springConfig }}
    className={`group relative rounded-4xl overflow-hidden border border-white/15 bg-nutral-500/50 backdrop-blur-3xl shadow-2xl ${className}`}
    >
     {/*spotlight */} 
     <motion.div 
       className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
       style={{background}}
     />

        {/*border highlight */}
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
        />

        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

       <div className="relative z-10 h-full">{children}</div>

    </motion.div>
  );
};

export default CrystalCard;
