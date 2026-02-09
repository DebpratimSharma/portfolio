import React from "react";
import SectionHeader from "../SectionHeader";
import CrystalCard from "../CrystalCard";
import RollingButton from "../RollingButton";
import MagneticButton from "../MagneticButton";
import { Download, Github } from "lucide-react";

function About() {
  const focusAreas = [
    "Frontend Architecture",
    "Backend Systems",
    "UI Motion & Micro-interactions",
    "Performance Optimization",
  ];

  const frontendSkills = ["React", "Next.js", "Tailwind CSS", "Framer Motion"];
  const backendSkills = ["Node.js", "Express", "MongoDB", "PostgreSQL"];
  const toolingSkills = ["Git", "GCP", "Vercel", "Figma"];

  return (
    <section id="about">
      <SectionHeader
        title="About"
        subtitle="Designing and engineering thoughtful digital systems."
      />
      <div className="w-full flex  flex-col  md:flex-row gap-8">
        {/* Left Card: Personal Narrative */}
        <CrystalCard className="w-full md:w-2/3 px-4 py-6 md:p-8" disableSpring={true}>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">
                Full-stack developer focused on{" "}
                <span className="text-cyan-500">intelligent, scalable systems</span>.
              </h2>
            </div>

            <p className="text-lg leading-loose  opacity-80">
              I believe in engineering that prioritizes clarity, performance, and long-term maintainability. I focus on building systems that scale cleanly, remain understandable over time, and feel deliberate in use.
            </p>

            <p className="text-lg leading-loose opacity-80">
              I enjoy architecting clean frontends, reliable backends, and interaction-driven interfaces. I'm particularly drawn to problems at the intersection of engineering rigor and user experience.
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-2 pt-8 md:pt-4 md:mt-0 border-t border-white/20 mt-4 opacity-65 md:opacity-100 md:border-none ">
              {focusAreas.map((area, index) => (
                <span
                  key={index}
                  className="text-sm px-3 py-1.5 border border-white/20 rounded-full bg-white/5"
                >
                  {area}
                </span>
              ))}
            </div>

            <div className="pt-6 md:pt-4">
              <RollingButton className="bg-white px-6 py-4" text="Download Resume">
                <Download className="w-5 h-5" />
              </RollingButton>
              <p className="text-xs opacity-50 mt-3 ml-4">PDF · Updated 2025</p>
            </div>
          </div>
        </CrystalCard>

        {/* Right Card: Technical Tooling */}
        <CrystalCard className="w-full md:w-1/3 px-4 py-6 md:p-8" disableSpring={true}>
          <h2 className="text-2xl font-bold mb-6 opacity-60">Technical Focus</h2>
          <div className="flex flex-col gap-6 relative">
            <div>
              <h3 className="text-xl font-semibold mb-3 opacity-70">Frontend</h3>
              <p className="text-lg opacity-60 leading-relaxed">
                {frontendSkills.join(" · ")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 opacity-70">Backend</h3>
              <p className="text-lg opacity-60 leading-relaxed">
                {backendSkills.join(" · ")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 opacity-70">Tooling</h3>
              <p className="text-lg opacity-60 leading-relaxed">
                {toolingSkills.join(" · ")}
              </p>
            </div>

            <div className="pt-6 md:pt-4 flex items-baseline-last justify-end h-full">
              <a href="https://github.com/DebpratimSharma"
              className="w-full"
                target="_blank"
                rel="noopener noreferrer">
              <RollingButton
                textColor="text-white"
                className="w-full inline-flex px-6 py-4 items-center justify-center rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-colors text-white font-semibold text-lg gap-3"
              >
                <Github className="w-5 h-5 mr-2" />
                View All Works
              </RollingButton>
              </a>
            </div>
          </div>
        </CrystalCard>
      </div>
    </section>
  );
}

export default About;
