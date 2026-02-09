import React from "react";
import CrystalCard from "../CrystalCard";

interface ExperienceCardProps {
  role?: string;
  organisation?: string;
  location?: string;
  period?: string;
  summary?: string;
  contributions?: string[];
  focus?: string[];
  techStack?: string[];
  brandColors?: string[];
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
  brandColors = ["#FFFFFF"],
}) => {
  const gradient = `linear-gradient(
  120deg,
  transparent 40%,
  ${brandColors[0]} 25%,
  ${brandColors[1]} 50%,
  ${brandColors[2] || brandColors[0]} 75%,
  transparent 100%
)`;

  return (
    <CrystalCard
      disableSpring={true}
      className="w-full relative flex flex-col gap-y-4 overflow-hidden"
    >  
      <div className="relative z-50 px-4 py-6 md:p-8">
        <div className="space-y-2 ">
          <h1 className="text-3xl font-bold">{role}</h1>
          <h2 className="text-xl font-semibold opacity-65">{organisation}</h2>
          <h3 className="text-lg opacity-60">
            <span className="text-cyan-200">{period}</span> . {location}
          </h3>
        </div>
        <div className="pt-4 text-shadow-lg">
          <p className="leading-relaxed text-lg opacity-80 border-b border-white/20 pb-4">
            {summary}
          </p>
          <ul className="opacity-80 pt-3 leading-loose">
            {contributions &&
              contributions.length > 0 &&
              contributions.map((contribution, index) => (
                <li key={index} className="list-disc list-inside py-1">
                  {contribution}
                </li>
              ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-3 pt-4 ">
          {focus &&
            focus.length > 0 &&
            focus.map((item, index) => (
              <span
                key={index}
                className="text-sm px-3 py-1.5 border border-white/20 rounded-full bg-white/5"
              >
                {item}
              </span>
            ))}
        </div>
        <div className="text-lg opacity-60 leading-relaxed pt-4 pl-3">
          {techStack?.join("  .  ")}
        </div>
      </div>
    </CrystalCard>
  );
};

export default ExperienceCard;
