import React from "react";
import CrystalCard from "../CrystalCard";
import RollingButton from "../RollingButton";

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
    <CrystalCard className="font-sans p-10 ">
      <div className="flex flex-col h-full w-full">
        <div className="flex">
          
          <h3 className="text-2xl font-bold text-white/40">
          {category}
          </h3>
        </div>
        <div className="py-5 space-y-8 ">
            <h1 className="text-5xl font-bold">{title}</h1>
            <p className="text-lg pr-56">{description}</p>
        </div>
        <div className="footer border-t border-white/30 pt-6 mt-auto flex items-center justify-between">
            <div className="tags flex items-center gap-2">
              {tech && tech.map((item, index) => (
                <span key={`${item}-${index}`} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">{item}</span>
              ))}
            </div>
            <div className="links flex gap-4 items-center justify-center">
                <RollingButton onClick={handleOnclickonView}  text="View Project" className="bg-white px-6  py-2.5" textColor="text-black" />
                <RollingButton onClick={handleOnclickonCode} text="View Code" className="bg-transparent px-6  py-2.5" textColor="text-white" /> 
            </div>
        </div>
      </div>
    </CrystalCard>
  );
};

export default ProjectCard;
