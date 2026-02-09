import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import MagneticButton from "./MagneticButton";
import { ArrowUpRight } from "lucide-react";
import RollingText from "./RollingText";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className=" py-12 md:py-16 my-15">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Section - Branding */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold font-syne">{PORTFOLIO_DATA.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Crafting scalable systems and thoughtful digital experiences.
            </p>
          </div>

          {/* Center Section - Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold opacity-70">Quick Links</h4>
            <nav className="space-y-2 flex flex-wrap gap-4">
              {[
                { label: "About", href: "#about" },
                { label: "Projects", href: "#projects" },
                { label: "Experience", href: "#experience" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white/100 transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Section - Social Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold opacity-70">Connect</h4>
            <div className="flex gap-3">
              {PORTFOLIO_DATA.socials.map((social, idx) => (
                <MagneticButton
                  key={idx}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-colors cursor-none"
                  aria-label={social.label}
                  href={social.href}
                  
                  
                >
                  <social.icon
                    size={18}
                    className="text-white/60 hover:text-white transition-colors"
                  />
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8">
          {/* Bottom Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left - Copyright */}
            <div className="text-center md:text-left">
              <p className="text-white/40 text-sm">
                © {currentYear} {PORTFOLIO_DATA.name}. All rights reserved.
              </p>
            </div>

            {/* Center - Status */}
            <div className="text-center">
              <p className="text-white/50 text-sm flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <RollingText>{PORTFOLIO_DATA.status}</RollingText>
              </p>
            </div>

            {/* Right - Back to Top */}
            <button
              onClick={scrollToTop}
              className="text-white/60 hover:text-white/100 transition-colors text-sm flex items-center gap-1 md:justify-end"
              aria-label="Back to top"
            >
              Back to Top
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
