import React from "react";
import SectionHeader from "../SectionHeader";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ProjectCard from "./ProjectCard";
import dynamic from "next/dynamic";



const Works = () => {
  return (
    <div id='projects'>
      <SectionHeader
        title="Selected Works"
        subtitle="Curated projects demonstrating my capabilities."
      />
      {/* Work items will go here */}

      <div className="w-full flex flex-col gap-y-8">
        {PORTFOLIO_DATA.projects.sort((a, b) => a.id - b.id).map((project, index) => (
          <div key={project.id}>
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;
