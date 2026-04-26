import React, { useState } from "react";
import CrystalCard from "../CrystalCard";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceCardProps {
  role?: string;
  organisation?: string;
  location?: string;
  period?: string;
  summary?: string;
  contributions?: string[];
  focus?: string[];
  techStack?: string[];
  brandColors?: string[];
  isCompact?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  role,
  organisation,
  location,
  period,
  summary,
  contributions,
  focus,
  techStack,
  brandColors = ["#FFFFFF"],
  isCompact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const gradient = `linear-gradient(
  120deg,
  transparent 40%,
  ${brandColors[0]} 25%,
  ${brandColors[1]} 50%,
  ${brandColors[2] || brandColors[0]} 75%,
  transparent 100%
)`;

  const renderContent = () => (
    <div className="relative z-50 px-4 py-6 md:p-8">
      <div className="space-y-2 ">
        <h1 className="text-3xl font-bold">{role}</h1>
        <h2 className="text-xl font-semibold opacity-65">{organisation} . <span className="text-sm text-cyan-300">{location}</span></h2>
        
      </div>
      <div className="pt-4 text-shadow-lg">
        <p className="leading-relaxed text-lg opacity-80 border-b border-white/20 pb-4">
          {summary}
        </p>
        <ul className="opacity-80 pt-3 leading-loose">
          {contributions &&
            contributions.length > 0 &&
            contributions.map((contribution, index) => (
              <li key={index} className="list-disc list-inside py-1">
                {contribution}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-3 pt-4 ">
        {focus &&
          focus.length > 0 &&
          focus.map((item, index) => (
            <span
              key={index}
              className="text-sm px-3 py-1.5 border border-white/20 rounded-full bg-white/5"
            >
              {item}
            </span>
          ))}
      </div>
      <div className="text-lg opacity-60 leading-relaxed pt-4 pl-3">
        {techStack?.join("  .  ")}
      </div>
    </div>
  );

  return (
    <>
      <CrystalCard
        disableSpring={true}
        className={`w-full relative flex flex-col gap-y-4 overflow-hidden ${isCompact ? 'h-64' : ''}`}
      >  
        {isCompact ? (
          <div className="relative z-50 px-4 py-6 h-full flex flex-col">
            <div className="space-y-2 flex-grow">
              <h1 className="text-2xl font-bold line-clamp-2">{role}</h1>
              <h2 className="text-lg font-semibold opacity-65 line-clamp-1">{organisation}</h2>
              <span className="text-sm text-cyan-300 block mt-1">{location}</span>
            </div>
            <button 
              onClick={() => setIsExpanded(true)}
              className="mt-4 w-full py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors font-medium text-sm text-cyan-300"
            >
              View Details
            </button>
          </div>
        ) : (
          renderContent()
        )}
      </CrystalCard>

      {/* Expanded Full Screen Mobile View */}
      <AnimatePresence>
        {isCompact && isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto flex flex-col"
          >
            <div className="sticky top-0 z-50 flex justify-between items-center p-4 bg-black/80 backdrop-blur-md border-b border-white/10">
              <span className="font-syne font-bold text-neutral-400">{period}</span>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="pb-20">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExperienceCard;
