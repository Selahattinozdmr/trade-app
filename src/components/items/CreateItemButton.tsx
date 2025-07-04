"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateItemModal } from "./CreateItemModal";

interface CreateItemButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function CreateItemButton({
  className = "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors",
  children = "İlan Ver",
}: CreateItemButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to show updated items
    router.refresh();
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        {children}
      </button>

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
