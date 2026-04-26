import React from "react";
import { motion } from "framer-motion";
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
        {PORTFOLIO_DATA.projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Works;
