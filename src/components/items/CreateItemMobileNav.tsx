"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateItemModal } from "./CreateItemModal";

interface CreateItemMobileNavProps {
  onClose?: () => void;
}

export function CreateItemMobileNav({ onClose }: CreateItemMobileNavProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Close mobile menu and refresh the page
    onClose?.();
    router.refresh();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Close mobile menu when opening modal
    onClose?.();
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="w-full flex items-center space-x-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-3 rounded-lg font-medium transition-colors"
      >
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>İlan Ver</span>
      </button>

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
