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
      {/* <div className="flex flex-col gap-y-8">
        {PORTFOLIO_DATA.experience.map((experience) => (
          <ExperienceCard key={experience.id} {...experience} />
        ))}
      </div> */}
      <motion.div 
        className="mt-16"
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
