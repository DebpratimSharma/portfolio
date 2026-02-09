import React from "react";
import CrystalCard from "../CrystalCard";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import SectionHeader from "../SectionHeader";
import RollingText from "../RollingText";
import MagneticButton from "../MagneticButton";
import { Linkedin, Github, Mail, Search, Clock } from "lucide-react";
import RollingButton from "../RollingButton";
import { div, span } from "framer-motion/client";
const Contact = () => {
  return (
    <section id="contact">
      <SectionHeader title="Contact" subtitle="Get in touch" />
      <CrystalCard className="w-full flex flex-col px-4 py-6 md:p-8">
        <div className="header w-full flex flex-col items-start sm:flex-row sm:items-end sm:justify-between border-b border-white/20 pb-4 mb-4 md:mb-6 gap-4 sm:gap-0">
          <div className="">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-syne font-bold">
              {PORTFOLIO_DATA.name}
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-cyan-500/70 pt-2">
              {PORTFOLIO_DATA.role}
            </h2>
          </div>

          <RollingText
            text={PORTFOLIO_DATA.status}
            className="py-2 rounded-full "
          />
        </div>
        <div className="body flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="left flex flex-col gap-3 items-start justify-start">
            <h1 className="flex gap-2 items-center">
              <div className=" bg-green-400 h-2 w-2 rounded-full animate-pulse shadow-2xl shadow-green-300"></div>
              {"Current status".toUpperCase()}
            </h1>
            <span className="text-green-300 bg-green-400/30 px-3.5 py-1.5 border rounded-full border-green-400/40">
              {PORTFOLIO_DATA.status}
            </span>
            <h2 className="flex gap-2 items-center">
              <Search height={17} />
              {"Looking for".toUpperCase()}
            </h2>
            <div className="flex flex-wrap gap-3">
              {PORTFOLIO_DATA.roles &&
                PORTFOLIO_DATA.roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-white/5 border border-white/15 rounded-full"
                  >
                    {role}
                  </span>
                ))}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-6">
            <a href="mailto:debpratimsharma33@gmail.com">
              <RollingButton
                text="Initialize Comms"
                className="w-full inline-flex px-7 py-5  items-center justify-center rounded-full bg-white text-black font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-none gap-3"
                
              >
                <Mail className="mr-1 h-5 w-5" />
              </RollingButton>
            </a>

            <div className="flex w-full justify-center gap-4">
              {PORTFOLIO_DATA.socials.map((social, idx) => (
                <MagneticButton
                  key={idx}
                  className="p-4 px-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-colors cursor-none group flex-1 flex justify-center"
                  aria-label={social.label}
                  href={social.href}
                >
                  <social.icon
                    size={20}
                    key={idx}
                    className="text-white/60 group-hover:text-white transition-colors"
                  />
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>
        <div className="pb-0 p-6 mt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="text-white/20 uppercase text-xs tracking-wider">
              Direct
            </span>
            <span className="text-white">debpratimsharma33@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Clock size={12} />
            <span>Response time: &lt; 24 hours</span>
          </div>
        </div>
      </CrystalCard>
    </section>
  );
};

export default Contact;
