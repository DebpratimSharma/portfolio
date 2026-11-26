"use client";

import React, { useState } from "react";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";

interface BaseMainButtonProps {
  /**
   * Button variant: "primary" (solid white -> black on hover) or "secondary" (transparent bg, customizable text)
   * @default "primary"
   */
  variant?: "primary" | "secondary";
  /**
   * Optional icon to display alongside the text
   */
  icon?: React.ReactNode;
  /**
   * Placement of the icon relative to the text
   * @default "left"
   */
  iconPosition?: "left" | "right";
  /**
   * Idle text & icon color for secondary variant (e.g. "text-white", "text-zinc-300")
   * @default "text-white"
   */
  textColor?: string;
  /**
   * Idle border color class
   * @default "border-white" for primary, "border-white/20" for secondary
   */
  borderColor?: string;
  /**
   * Custom background color on hover
   */
  hoverBg?: string;
  /**
   * Custom text color on hover
   */
  hoverTextColor?: string;
  /**
   * Custom border color on hover
   */
  hoverBorderColor?: string;
  /**
   * Additional custom class names
   */
  className?: string;
  /**
   * The button label or content
   */
  children: React.ReactNode;
}

export type MainButtonProps = BaseMainButtonProps &
  (
    | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  );

export function MainButton({
  variant = "primary",
  icon,
  iconPosition = "left",
  textColor,
  borderColor,
  hoverBg,
  hoverTextColor,
  hoverBorderColor,
  className,
  children,
  ...props
}: MainButtonProps) {
  const [hoverKey, setHoverKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isPrimary = variant === "primary";

  // Base styling matching the design in Hero.tsx
  const baseClasses =
    "group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-7 sm:px-8 py-3 rounded-full font-syne font-bold text-xs sm:text-sm tracking-[0.16em] uppercase cursor-pointer select-none transition-all duration-300 ease-out border shadow-sm active:scale-95";

  // Compute variant-specific color schemes
  let variantClasses = "";
  let textAnimateColor = "";

  if (isPrimary) {
    if (isHovered) {
      variantClasses =
        "bg-black text-white border-white shadow-[0_0_24px_rgba(255,255,255,0.25)]";
      textAnimateColor = "text-white";
    } else {
      variantClasses =
        "bg-white text-black border-white hover:bg-black hover:text-white";
      textAnimateColor = "text-black group-hover:text-white";
    }
  } else {
    // Secondary: idle bg transparent, customizable text color
    const idleText = textColor || "text-white";
    const idleBorder = borderColor || "border-white/20";
    const activeBg = hoverBg || "bg-white";
    const activeText = hoverTextColor || "text-black";
    const activeBorder = hoverBorderColor || "border-white";

    if (isHovered) {
      variantClasses = cn(
        activeBg,
        activeText,
        activeBorder,
        "shadow-[0_0_24px_rgba(255,255,255,0.25)]"
      );
      textAnimateColor = activeText;
    } else {
      variantClasses = cn(
        "bg-transparent",
        idleBorder,
        idleText,
        `hover:${activeBg} hover:${activeText} hover:${activeBorder}`
      );
      textAnimateColor = cn(idleText, `group-hover:${activeText}`);
    }
  }

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement>
  ) => {
    setIsHovered(true);
    setHoverKey((prev) => prev + 1);
    props.onMouseEnter?.(e);
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement>
  ) => {
    setIsHovered(false);
    props.onMouseLeave?.(e);
  };

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span
        className={cn(
          "w-4 h-4 shrink-0 transition-all duration-300 flex items-center justify-center",
          isHovered
            ? "-translate-y-0.5"
            : "group-hover:-translate-y-0.5"
        )}
      >
        {icon}
      </span>
    );
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === "left" && renderIcon()}
      {typeof children === "string" ? (
        <TextAnimate
          key={hoverKey}
          animation="blurInUp"
          by="character"
          duration={0.25}
          as="span"
          startOnView={false}
          className={cn(
            "inline-block whitespace-nowrap font-syne font-bold text-[inherit] tracking-[0.16em] uppercase transition-colors duration-300",
            textAnimateColor
          )}
          segmentClassName="tracking-[0.16em]"
        >
          {children}
        </TextAnimate>
      ) : (
        <span
          className={cn(
            "inline-block whitespace-nowrap font-syne font-bold text-[inherit] tracking-[0.16em] uppercase transition-colors duration-300",
            textAnimateColor
          )}
        >
          {children}
        </span>
      )}
      {icon && iconPosition === "right" && renderIcon()}
    </>
  );

  const combinedClassName = cn(baseClasses, variantClasses, className);

  if ("href" in props && typeof props.href === "string") {
    const { href, download, target, rel, ...anchorProps } = props as {
      href: string;
      download?: string | boolean;
      target?: string;
      rel?: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <a
        href={href}
        download={typeof download === "string" ? download : download ? "" : undefined}
        target={target}
        rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={combinedClassName}
        {...anchorProps}
      >
        {renderContent()}
      </a>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={buttonProps.type || "button"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={combinedClassName}
      {...buttonProps}
    >
      {renderContent()}
    </button>
  );
}

export default MainButton;
