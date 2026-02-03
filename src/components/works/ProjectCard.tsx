import React, {useMemo, useState} from "react";
import CrystalCard from "../CrystalCard";
import RollingButton from "../RollingButton";
import {Globe, Github, ChevronDown, ChevronUp} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "../../data/portfolio";

interface ProjectCardProps{
    id?: number;
    category?: string;
    title?: string;
    description?: string;
    link?: string;
    github?: string;
    tech?: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({id, category, title, description, link, github, tech}) => {
  const [expanded, setExpanded] = useState(false);

  const projectDetails = useMemo(() => {
    if (!id) return undefined;
    const pid = typeof id === "number" ? id : Number(id);
    return PORTFOLIO_DATA.projects.find(p => p.id === pid)?.details;
  }, [id]);
  const handleOnclickonView = () =>{
    if (!link) return;
    window.open(link, "_blank", "noreferrer");
  }
  const handleOnclickonCode = () =>{
    if (!github) return;
    window.open(github, "_blank", "noreferrer");
  }

  const toggleExpanded = () => setExpanded(v => !v);
  return (
    <CrystalCard className="font-sans px-4 py-6 md:p-8"
    onClick={toggleExpanded}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex items-start justify-between">
          
          <h3 className="text-2xl font-bold text-white/40">
          {category}
          </h3>
          <button onClick={(e) => { e.stopPropagation(); toggleExpanded(); }} aria-expanded={expanded} className="text-sm text-white/80 flex items-center gap-2 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all duration-300">
                  {expanded?(<ChevronUp className="w-4 h-4" />):(<ChevronDown className="w-4 h-4" />)}
          </button>
        </div>
        <div className="main py-5 space-y-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>
            <p className="text-lg max-w-full md:max-w-4xl lg:max-w-5xl">{description}</p>
        </div>

        {/* Expanded details inserted here between main and footer */}
        <AnimatePresence initial={false}>
          {expanded && projectDetails && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="expanded overflow-hidden mb-2 pl-4 border-l-2 border-white/25 rounded-xs"
            >
              <div className="rounded-lg  ">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-lg font-semibold">Project Details</h4>
                  
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
                  <div>
                    <p className="font-semibold">Problem</p>
                    <p className="mt-1 text-sm text-white/70">{projectDetails.problem}</p>

                    <p className="font-semibold mt-3">Role</p>
                    <p className="mt-1 text-sm text-white/70">{projectDetails.role}</p>

                    <p className="font-semibold mt-3">Impact</p>
                    <p className="mt-1 text-sm text-white/70">{projectDetails.impact}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Architecture</p>
                    <ul className="list-disc ml-5 mt-1 text-white/70">
                      {projectDetails.architecture?.map((a: string, i: number) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>

                    <p className="font-semibold mt-3">Challenges</p>
                    <ul className="list-disc ml-5 mt-1 text-white/70">
                      {projectDetails.challenges?.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={`footer ${!expanded && "border-t border-white/30"} pt-6 mt-auto flex flex-col md:flex-row gap-y-5 gap-x-4 items-center justify-between`}>
            <div className="tags w-full flex flex-wrap items-center gap-2">
              {tech && tech.map((item, index) => (
                <span key={`${item}-${index}`} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">{item}</span>
              ))}
            </div>
            <div className="links flex gap-4 justify-center md:justify-end w-full">
                <div onClick={(e) => e.stopPropagation()}>
                  <RollingButton onClick={handleOnclickonView}  text="Live Site" className="bg-white px-6  py-2.5" textColor="text-black"><Globe className="w-5 h-5" /></RollingButton>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <RollingButton onClick={handleOnclickonCode} text="Repository" className="bg-transparent px-5  py-2.5" textColor="text-white"><Github className="w-5 h-5" /></RollingButton>
                </div>
            </div>
        </div>
      </div>
    </CrystalCard>
  );
};

export default ProjectCard;
