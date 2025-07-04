"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateItemModal } from "./CreateItemModal";

export function CreateItemLink() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to show updated items
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2 transition-colors duration-200 cursor-pointer"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        İlan Ver
      </button>

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
