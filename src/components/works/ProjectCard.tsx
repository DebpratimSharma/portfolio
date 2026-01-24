import React from "react";
import CrystalCard from "../CrystalCard";
import RollingButton from "../RollingButton";
import {Globe, Github} from "lucide-react";

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
  const handleOnclickonView = () =>{
    window.open(link, "_blank", "noreferrer");
  }
  const handleOnclickonCode = () =>{
    window.open(github, "_blank", "noreferrer");
  }
  return (
    <CrystalCard className="font-sans md:p-10 p-8 ">
      <div className="flex flex-col h-full w-full">
        <div className="flex">
          
          <h3 className="text-2xl font-bold text-white/40">
          {category}
          </h3>
        </div>
        <div className="py-5 space-y-8 ">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>
            <p className="text-lg max-w-full md:max-w-4xl lg:max-w-5xl">{description}</p>
        </div>
        <div className="footer border-t border-white/30 pt-6 mt-auto flex flex-col md:flex-row gap-y-5 gap-x-4 items-center justify-between">
            <div className="tags w-full flex flex-wrap items-center gap-2">
              {tech && tech.map((item, index) => (
                <span key={`${item}-${index}`} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">{item}</span>
              ))}
            </div>
            <div className="links flex flex-col md:flex-row gap-4 items-start md:justify-end w-full">
                <RollingButton onClick={handleOnclickonView}  text="Live Site" className="bg-white px-6  py-2.5" textColor="text-black"><Globe className="w-5 h-5" /></RollingButton>
                <RollingButton onClick={handleOnclickonCode} text="Repository" className="bg-transparent px-5  py-2.5" textColor="text-white"><Github className="w-5 h-5" /></RollingButton>
            </div>
        </div>
      </div>
    </CrystalCard>
  );
};

export default ProjectCard;
