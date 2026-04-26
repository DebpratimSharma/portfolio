import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../SectionHeader";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ExperienceCard from "./ExperienceCard";
import { Timeline } from "../ui/timeline";

function Experiece() {
  const timelineData = PORTFOLIO_DATA.experience.map((experience) => ({
    title: `${experience.period}`,
    content: (
      <div className="pb-8">
        <ExperienceCard key={experience.id} {...experience} />
      </div>
    ),
  }));

  return (
    <section id="experience">
      <SectionHeader
        title="Experience"
        subtitle="Hands-on work across communities, teams, and real-world systems."
      />
      {/* Horizontal scrolling cards for mobile */}
      <div className="md:hidden mt-8 flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {PORTFOLIO_DATA.experience.map((experience) => (
          <div key={experience.id} className="min-w-[85vw] snap-center flex flex-col">
            <h3 className="text-xl mb-4 font-syne font-bold text-neutral-500">
              {experience.period}
            </h3>
            <ExperienceCard {...experience} isCompact={true} />
          </div>
        ))}
      </div>

      {/* Scroll indicator for mobile */}
      <div className="md:hidden flex items-center justify-center mt-2 mb-8 text-cyan-300/70 gap-2">
        <span className="text-sm font-medium">Swipe to explore</span>
        <motion.svg 
          animate={{ x: [0, 5, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </motion.svg>
      </div>

      {/* Vertical Timeline for md+ screens */}
      <motion.div 
        className="hidden md:block mt-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <Timeline
          data={timelineData}
        />
      </motion.div>
    </section>
  );
}

export default Experiece;
