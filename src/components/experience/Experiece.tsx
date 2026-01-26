import React from "react";
import SectionHeader from "../SectionHeader";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ExperienceCard from "./ExperienceCard";

function Experiece() {
  return (
    <section className="max-w-340 mx-auto px-4" id="experience">
      <SectionHeader
        title="Experience"
        subtitle="Hands-on work across communities, teams, and real-world systems."
      />
      <div className="flex flex-col gap-y-8">
      {PORTFOLIO_DATA.experience.map((experience, index) => (
        <ExperienceCard key={experience.id} {...PORTFOLIO_DATA.experience[index]} />
      ))}
      </div>
    </section>
    
  );
}

export default Experiece;
