"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import TextAnimate from "./text-animate";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  target?: string;
  rel?: string;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}

export function InteractiveHoverButton({
  children,
  className,
  href,
  onClick,
  target,
  rel,
  variant = "primary",
  icon,
  ...props
}: InteractiveHoverButtonProps) {
  const isSecondary = variant === "secondary";

  const commonClasses = cn(
    "group relative inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-full backdrop-blur-md px-5 py-2 text-center text-sm font-medium transition-all duration-300 active:scale-95 select-none whitespace-nowrap",
    isSecondary
      ? "border border-white/15 bg-white/[0.03] text-zinc-300 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
      : "border border-white/20 bg-transparent text-white hover:border-white/50",
    className
  );

  const innerContent = isSecondary ? (
    <div className="flex items-center justify-center gap-2">
      {icon ? (
        <span className="shrink-0 transition-transform duration-300 group-hover:scale-110 text-zinc-400 group-hover:text-white">
          {icon}
        </span>
      ) : (
        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 transition-colors duration-300 group-hover:bg-white" />
      )}
      {typeof children === "string" ? (
        <TextAnimate
          animation="blurInUp"
          by="character"
          duration={0.25}
          as="span"
          startOnView={false}
          className={cn("inline-block whitespace-nowrap transition-colors duration-300")}
          delay={0.1}
        >
          {children}
        </TextAnimate>
      ) : (
        <span className="inline-block whitespace-nowrap transition-colors duration-300">
          {children}
        </span>
      )}
    </div>
  ) : (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 shrink-0 rounded-full bg-white transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-6 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-1.5 px-4 text-[#040814] opacity-0 translate-x-4 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span className="font-semibold whitespace-nowrap">{children}</span>
        {icon ? (
          <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
            {icon}
          </span>
        ) : (
          <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={commonClasses}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
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
