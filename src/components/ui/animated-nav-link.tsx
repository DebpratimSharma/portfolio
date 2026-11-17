"use client";

import React, { useState } from "react";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";

export interface AnimatedNavLinkProps {
  href: string;
  children: string;
  className?: string;
  animation?:
    | "fadeIn"
    | "blurIn"
    | "blurInUp"
    | "blurInDown"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleUp"
    | "scaleDown";
  by?: "character" | "word" | "text" | "line";
  duration?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
}

/**
 * Anchor tag component that triggers Magic UI TextAnimate on hover.
 */
export function AnimatedNavLink({
  href,
  children,
  className = "",
  animation = "blurInUp",
  by = "character",
  duration = 0.25,
  onClick,
  title,
  ariaLabel,
  target,
  rel,
}: AnimatedNavLinkProps) {
  const [hoverKey, setHoverKey] = useState(0);

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseEnter={() => setHoverKey((prev) => prev + 1)}
      className={cn(
        "group relative inline-flex items-center justify-center cursor-pointer select-none",
        className
      )}
      title={title}
      aria-label={ariaLabel || children}
    >
      <TextAnimate
        key={hoverKey}
        animation={animation}
        by={by}
        duration={duration}
        as="span"
        startOnView={false}
        className="inline-block whitespace-nowrap"
      >
        {children}
      </TextAnimate>
    </a>
  );
}

export default AnimatedNavLink;
