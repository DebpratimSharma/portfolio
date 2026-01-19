"use client";
import React, { ReactNode } from "react";

interface RollingTextprops {
  text: string;
  children: ReactNode;
}

const RollingText: React.FC<RollingTextprops> = ({ text, children }) => {
  const isChidlrenString = typeof children === "string";
  const rollingText = text || (isChidlrenString ? children : "");
  const staticContent = isChidlrenString && !text ? null : children;
  const characters = rollingText.split("");
  const hasAnimatedContent = characters.length > 0;
  return (
    <div className="group relative flex items-center justify-center gap-2">
      {rollingText && <span className="sr-only">{rollingText}</span>}
      {staticContent && (
        <span className="relative flex items-center text-white transition-colors duration-500 group-hover:text-white">
          {staticContent}
        </span>
      )}
      {hasAnimatedContent && (
        <div
          className="flex items-center justify-center gap-px notranslate "
          aria-hidden="true"
          translate="no"
        >
          {characters.map((char, index) => (
            <div
              key={index}
              className="relative overflow-hidden flex flex-col justify-start w-auto min-w-[0.6rem] h-5"
            >
              <div
                className="transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2"
                style={{ transitionDelay: `${index * 0.025}s` }}
              >
                <span
                  className={`flex items-center justify-center text-white`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
                <span
                  className={`flex items-center justify-center text-white`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RollingText;