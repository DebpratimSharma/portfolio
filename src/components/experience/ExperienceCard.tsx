import React from "react";
import CrystalCard from "../CrystalCard";
import { span } from "framer-motion/client";
interface ExperienceCardProps {
  role?: string;
  organisation?: string;
  location?: string;
  period?: string;
  summary?: string;
  contributions?: string[];
  focus?: string[];
  techStack?: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  role,
  organisation,
  location,
  period,
  summary,
  contributions,
  focus,
  techStack,
}) => {
  return (
    <CrystalCard disableSpring={true} className="w-full p-4 py-6 md:px-8 flex flex-col gap-y-4    ">
      <div className="space-y-2 ">
        <h1 className="text-3xl font-bold">{role}</h1>
        <h2 className="text-xl font-semibold opacity-65">{organisation}</h2>
        <h3 className="text-lg">
          {period} . {location}
        </h3>
      </div>
      <div className="pt-4 text-shadow-lg">
        <p className="leading-relaxed">{summary}</p>
        <ul className="leading-loose ">
        {contributions &&
          contributions.length > 0 &&
          contributions.map((contribution, index) => (
            <li key={index} className="list-disc list-inside">
              {contribution}
            </li>
          ))}
          </ul>
      </div>
      <div className="flex flex-wrap gap-3 pt-4 ">
        {focus && focus.length > 0 && focus.map((item,index)=>(
            <span key={index} className="text-sm px-3 py-1.5 border border-white/20 rounded-full bg-white/5" >{item}</span>
        ))}
      </div>
      <div className="text-lg opacity-60 leading-relaxed pt-4 pl-3">
        {techStack?.join("  .  ")}
      </div>
    </CrystalCard>
  );
};

export default ExperienceCard;
