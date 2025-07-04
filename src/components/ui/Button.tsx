import React from "react";
import type { BaseComponentProps } from "@/types";
import { cn } from "@/utils/common";

interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "cursor-pointer font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl";

  const variantStyles = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    outline:
      "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
