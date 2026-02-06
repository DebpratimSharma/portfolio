"use client";

import React, { useEffect, useState } from 'react';

interface RollingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  containerHeight?: string;
  textColor?: string;
}

const RollingText: React.FC<RollingTextProps> = ({
  text,
  children,
  className = "",
  containerHeight = "h-5",
  textColor = "text-white",
  ...props
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouchDevice(mq.matches);
  }, []);

  const isChildrenString = typeof children === 'string';
  const rollingText = text || (isChildrenString ? children : '');
  const staticContent = isChildrenString && !text ? null : children;

  const characters = rollingText.split('');
  const hasAnimatedContent = characters.length > 0 && !isTouchDevice;

  return (
    <div
      className={`group relative flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {/* Hidden contiguous text for Screen Readers */}
      {rollingText && <span className="sr-only">{rollingText}</span>}

      {/* Static Content (Icons) */}
      {staticContent && (
        <span className={`relative z-10 flex items-center ${textColor} transition-colors duration-500 group-hover:text-white`}>
          {staticContent}
        </span>
      )}

      {/* Rolling Text Animation */}
      {hasAnimatedContent && (
        <div
          className="flex items-center justify-center gap-px notranslate"
          aria-hidden="true"
          translate="no"
        >
          {characters.map((char, index) => (
            <div
              key={index}
              className={`relative overflow-hidden ${containerHeight} flex flex-col justify-start w-auto min-w-[0.6em]`}
            >
              <div
                className="transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2"
                style={{ transitionDelay: `${index * 0.025}s` }}
              >
                <span className={`${containerHeight} flex items-center justify-center ${textColor}`}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
                <span className={`${containerHeight} flex items-center justify-center text-white`}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Static Text for Touch Devices */}
      {!hasAnimatedContent && rollingText && (
        <span className={`relative z-10 ${textColor} transition-colors duration-500 group-hover:text-white`}>
          {rollingText}
        </span>
      )}
    </div>
  );
};

export default RollingText;