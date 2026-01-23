"use client";

import React from 'react';

interface RollingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  containerHeight?: string;
  textColor?: string;
}

const RollingButton: React.FC<RollingButtonProps> = ({ 
  text, 
  children,
  className="px-8 py-5", 
  containerHeight = "h-5", 
  textColor = "text-black",
  ...props 
}) => {
  // Logic: 
  // 1. If 'text' is explicitly provided, use it for the rolling animation. 'children' is treated as the icon.
  // 2. If 'text' is MISSING, and 'children' is a plain string, treat 'children' as the rolling text.
  // 3. Otherwise, render 'children' as static content (icon).

  const isChildrenString = typeof children === 'string';
  const rollingText = text || (isChildrenString ? children : '');
  const staticContent = isChildrenString && !text ? null : children;
  
  const characters = rollingText.split('');
  const hasAnimatedContent = characters.length > 0;

  return (
    <button
      className={`group/button relative overflow-hidden rounded-full border border-white/20 font-medium transition-all hover:border-white ${className}`}
      aria-label={rollingText || 'Button'}
      {...props}
    >
      {/* Background Fill Animation */}
      <div className="absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/button:translate-y-0" />

      {/* Content Wrapper */}
      <div className="relative flex items-center justify-center gap-2">
        
        {/* Hidden contiguous text for Translation Engines & Accessibility.
            This prevents browsers from mistaking the split letters below for a foreign language.
            'sr-only' is a standard Tailwind utility for visually hidden but accessible text.
        */}
        {rollingText && <span className="sr-only">{rollingText}</span>}

        {/* Static Content (Icons) - Swaps color only, no rolling */}
        {staticContent && (
            <span className={`relative z-10 flex items-center ${textColor} transition-colors duration-500 group-hover/button:text-white`}>
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
                    className="transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/button:-translate-y-1/2"
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
      </div>
    </button>
  );
};

export default RollingButton;