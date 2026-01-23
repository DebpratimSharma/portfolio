import React from "react";
import CrystalCard from "../CrystalCard";
import RollingButton from "../RollingButton";

interface ProjectCardProps{
    projectType?: string;
    projecttitle?: string;
    projectDescription?: string;
    projectLink?: string;
    projectCode?: string;
    projecttags?: string[];
}

const Projectcard = () => {
  return (
    <CrystalCard className="font-sans p-10">
      <div className="flex flex-col h-full w-full">
        <div className="flex">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500/20 border border-white/10">
            <span className="text-cyan-600">01</span>
          </div>
          <h3 className="text-2xl font-bold text-white/40 ml-4">
            Project Category
          </h3>
        </div>
        <div className="py-5 space-y-8 ">
            <h1 className="text-5xl font-bold">Project Title</h1>
            <p className="text-lg pr-56">Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className="footer border-t border-white/30 pt-6 mt-auto flex items-center justify-between">
            <div className="tags flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">React</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">TypeScript</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">TailwindCSS</span>
            </div>
            <div className="links flex gap-4 items-center justify-center">
                <RollingButton onClick={()=>{}}  text="View Project" className="bg-white px-6  py-2.5" textColor="text-black" />
                <RollingButton onClick={()=>{}} text="View Code" className="bg-transparent px-6  py-2.5" textColor="text-white" /> 
                

            </div>
        </div>
      </div>
    </CrystalCard>
  );
};

export default Projectcard;
