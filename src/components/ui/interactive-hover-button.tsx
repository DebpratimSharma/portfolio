"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
}

export function InteractiveHoverButton({
  children,
  className,
  href,
  onClick,
  ...props
}: InteractiveHoverButtonProps) {
  const commonClasses = cn(
    "group relative inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 bg-transparent backdrop-blur-md px-5 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:border-white/50 active:scale-95 select-none whitespace-nowrap",
    className
  );

  const innerContent = (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 shrink-0 rounded-full bg-white transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-6 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-1.5 px-4 text-[#040814] opacity-0 translate-x-4 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span className="font-semibold whitespace-nowrap">{children}</span>
        <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={commonClasses}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button className={commonClasses} onClick={onClick} {...props}>
      {innerContent}
    </button>
  );
}

export default InteractiveHoverButton;
