import React from "react";
import CrystalCard from "../CrystalCard";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import SectionHeader from "../SectionHeader";
import RollingText from "../RollingText";
import MagneticButton from "../MagneticButton";
import { Linkedin, Github, Mail } from "lucide-react";
import RollingButton from "../RollingButton";
import { div } from "framer-motion/client";
const Contact = () => {
  return (
    <section id="contact">
      <SectionHeader title="Contact" subtitle="Get in touch" />
      <CrystalCard className="w-full flex flex-col p-8 ">
        <div className="header w-full  flex items-end justify-between border-b border-white/20 pb-4 mb-4">
          <div className="">
            <h1 className="text-4xl font-syne font-bold">
              {PORTFOLIO_DATA.name}
            </h1>
            <h2 className="text-xl font-bold text-cyan-500/70 pt-2">
              {PORTFOLIO_DATA.role}
            </h2>
          </div>
          <div className="">
            <RollingText
              text={PORTFOLIO_DATA.status}
              className="px-4 py-2 rounded-full"
            />
          </div>
        </div>
        <div className="body w-full grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl">Contact</span>
            <MagneticButton>
              <RollingButton
                className="bg-white px-6 py-4 mt-4"
                text="Say Hello"
                onClick={() =>
                  window.open(`mailto:debpratimsharma33@gmail.com`, "_blank")
                }
              >
                <Mail className="w-5 h-5" />
              </RollingButton>
            </MagneticButton>
            <MagneticButton>
              <RollingButton
                className="bg-transparent px-6 py-4 mt-4"
                text="LinkedIn"
                textColor="text-white"
                onClick={() =>
                  window.open(`mailto:debpratimsharma33@gmail.com`, "_blank")
                }
              >
                <Linkedin className="w-5 h-5" />
              </RollingButton>
            </MagneticButton>
            <div className="my-4 px-4 rounded-xs border-l-3 border-white/30">
              <span className="font-bold text-xl">Direct Contact</span>
              <p className="text-lg opacity-80 mt-4">Email: debpratimsharma33@gmail.com</p>
              <p className="text-lg opacity-80 mt-2">Response Time: Usually within 24 hours</p>
            </div>
          </div>
          <div className="flex justify-center flex-col gap-2">
            <span className="text-xl font-bold">Current Status</span>
            {PORTFOLIO_DATA.statusDescription &&
              PORTFOLIO_DATA.statusDescription.map((line, index) => (
                <p key={index} className="text-lg opacity-80 ">
                  * {line}
                </p>
              ))}
            <span className="text-xl font-bold">Current Status</span>
            {PORTFOLIO_DATA.roles &&
              PORTFOLIO_DATA.roles.map((line, index) => (
                <p key={index} className="text-lg opacity-80 ">
                  * {line}
                </p>
              ))}
          </div>
        </div>
        <div className="footer flex items-center justify-center gap-15 my-5">
          <MagneticButton href="https://www.linkedin.com/in/debpratim-sharma-916203267/">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl">
            <Linkedin />
          </div>
        </MagneticButton>
        <MagneticButton href="https://github.com/DebpratimSharma">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl">
            <Github />
          </div>
        </MagneticButton>
        <MagneticButton href="">
          <div className="p-3 bg-cyan-500/20 border border-white/20 rounded-2xl">
            <Mail />
          </div>
        </MagneticButton>
        </div>
      </CrystalCard>
    </section>
  );
};

export default Contact;
