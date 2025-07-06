"use client";

import Image from "next/image";
import { getDisplayName, getInitials } from "@/utils/avatar";
import type { User } from "@/types/app";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function UserAvatar({
  user,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const displayName = getDisplayName(user);
  const initials = getInitials(user.display_name || user.full_name, user.email);
  const sizeClass = sizeClasses[size];

  if (user.avatar_url) {
    return (
      <div
        className={`${sizeClass} relative rounded-full overflow-hidden ${className}`}
      >
        <Image
          src={user.avatar_url}
          alt={displayName}
          fill
          className="object-cover"
          sizes={size === "sm" ? "32px" : size === "md" ? "40px" : "48px"}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} bg-orange-500 rounded-full flex items-center justify-center text-white font-medium ${className}`}
    >
      <span
        className={
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
        }
      >
        {initials}
      </span>
    </div>
  );
}
