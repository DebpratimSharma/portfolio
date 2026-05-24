import React from "react";
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
      {/* Vertical Timeline for md+ screens */}
      <div className="mt-16">
        <Timeline
          data={timelineData}
        />
      </div>
    </section>
  );
}

export default Experiece;
