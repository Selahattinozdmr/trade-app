"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContactOwnerButtonProps {
  ownerId: string;
  currentUserId: string;
  ownerName?: string;
}

export function ContactOwnerButton({
  ownerId,
  currentUserId,
  ownerName,
}: ContactOwnerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContactOwner = async () => {
    if (ownerId === currentUserId) {
      return; // Don't allow messaging yourself
    }

    setIsLoading(true);
    try {
      // Navigate to messages page with the owner's ID
      router.push(`/messages/${ownerId}`);
    } catch (error) {
      console.error("Error navigating to messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if it's the current user's item
  if (ownerId === currentUserId) {
    return null;
  }

  return (
    <button
      onClick={handleContactOwner}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Yükleniyor...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>
            {ownerName ? `${ownerName} ile İletişim` : "Sahibi ile İletişim"}
          </span>
        </>
      )}
    </button>
  );
}
