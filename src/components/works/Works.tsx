import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../SectionHeader";
import { PORTFOLIO_DATA } from "@/data/portfolio";
// import Projectcard from "./Projectcard";
import dynamic from "next/dynamic";

const ProjectCard = dynamic(() => import("./ProjectCard"));

const Works = () => {
  return (
    <div className="w-full px-72" id='projects'>
      <SectionHeader
        title="Works"
        subtitle="A selection of my recent projects."
      />
      {/* Work items will go here */}

      <motion.div
        // initial={{ opacity: 0, x: 80 }}
        // whileInView={{ opacity: 1, x: 0 }}
        // viewport={{ once: true, margin: "-100px" }}
        // transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full flex flex-col gap-y-8"
      >
        {PORTFOLIO_DATA.projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </motion.div>
    </div>
  );
};

export default Works;
