import React from "react";
import type { SectionProps } from "@/types";
import { cn } from "@/utils/common";

interface SectionContainerProps extends SectionProps {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  padding?: "sm" | "md" | "lg";
  background?: "white" | "gray" | "orange" | "transparent";
}

export function SectionContainer({
  children,
  className,
  id,
  maxWidth = "7xl",
  padding = "lg",
  background = "white",
}: SectionContainerProps) {
  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "7xl": "max-w-7xl",
  };

  const paddingStyles = {
    sm: "px-4 md:px-6 lg:px-8 py-10",
    md: "px-6 md:px-8 lg:px-12 py-16",
    lg: "px-6 md:px-12 lg:px-20 py-20",
  };

  const backgroundStyles = {
    white: "bg-white",
    gray: "bg-gray-50",
    orange: "bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200",
    transparent: "bg-transparent",
  };

  return (
    <section id={id} className={cn(backgroundStyles[background], className)}>
      <div
        className={cn(
          maxWidthStyles[maxWidth],
          "mx-auto",
          paddingStyles[padding]
        )}
      >
        {children}
      </div>
    </section>
  );
}
