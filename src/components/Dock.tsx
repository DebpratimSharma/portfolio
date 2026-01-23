"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  AnimatePresence,
  spring,
} from "framer-motion";
import { Sparkles, Code2, User, Layers, Mail } from "lucide-react";

interface DockItemProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  active: boolean;
  href: string;
  onClick?: () => void;
  mouseX: ReturnType<typeof useMotionValue<number>>;
}

const DockItem: React.FC<DockItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
  mouseX,
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const distance = useMotionValue(Infinity);
  const [isHovered, setHovered] = useState(false);

  //detect the deice
  const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  //calculate distance
  useAnimationFrame(() => {
    if (!canHover || !ref.current) {
      distance.set(Infinity);
      return;
    }

    const rect = ref.current.getBoundingClientRect(); //?
    const centerX = rect.left + rect.width / 2;
    //absolute distance
    const d = Math.abs(mouseX.get() - centerX);
    distance.set(d);
  });
  //Map distance to width : closer => larger
  const width = useTransform(distance, [-150, 0, 150], [50, 80, 50]); //?
  const widthSpring = useSpring(width, { damping: 25, stiffness: 200 });

  return (
    <motion.a
      ref={ref}
      href={href}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.85, translateY: 5 }}
      style={{ width: widthSpring, height: widthSpring }}
      className="relative flex items-center justify-center rounded-2xl cursor-pointer bg-[#03333b] backdrop-blur-md border border-white/20 text-white"
    >
      <Icon size={20} strokeWidth={2} />
      {/*Hover Tooltip*/}
      <AnimatePresence>
        {isHovered && !active && (
          <motion.span
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: -50, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="absolute left-1/2 -top-2 px-2 py-1 rounded bg-black/20 backdrop-blur-md z-50 text-white border-px border-white/20"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/*Active Label*/}
      {active && (
        <div className="absolute -bottom-3.75 h-px w-px p-0.75 bg-white/50 rounded-full" />
      )}
    </motion.a>
  );
};

interface DockProps {
  currentSection: string;
}

const Dock: React.FC<DockProps> = ({ currentSection }) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="z-40 flex  gap-3 px-5 pb-4 h-20.75 items-end rounded-3xl bg-[#02333c]/30 border border-white/20 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] ring-1 ring-white/5"
      >
        <DockItem
          
          mouseX={mouseX}
          href="#hero"
          icon={Sparkles}
          label="Hero"
          active={currentSection === "hero"}
          
        />
        <DockItem
          mouseX={mouseX}
          href="#projects"
          icon={Code2}
          label="Work"
          active={currentSection === "projects"}
          
        />
        <DockItem
          mouseX={mouseX}
          href="#"
          icon={User}
          label="Skills"
          active={currentSection === "skills"}
          
        />
        <DockItem
          mouseX={mouseX}
          href="#"
          icon={Layers}
          label="History"
          active={currentSection === "experience"}
          
        />

        <div className="w-px h-8 bg-white/10 mx-1 mb-2" />

        <DockItem
          mouseX={mouseX}
          href="#"
          icon={Mail}
          label="Contact"
          active={currentSection === "contact"}
          
        />
      </motion.div>
    </div>
  );
};

export default Dock;
