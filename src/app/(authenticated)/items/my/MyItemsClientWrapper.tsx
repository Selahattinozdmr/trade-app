"use client";

import { useState } from "react";
import { MyItemsHeader } from "./MyItemsHeader";
import { MyItemsContent } from "./MyItemsContent";
import type { User } from "@/types/app";

interface MyItemsClientWrapperProps {
  user: User;
  searchParams: Record<string, string | string[] | undefined>;
}

export function MyItemsClientWrapper({
  user,
  searchParams,
}: MyItemsClientWrapperProps) {
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const handleOpenModal = () => {
    setShouldOpenModal(true);
    // Reset the trigger after a small delay to allow the effect to run
    setTimeout(() => setShouldOpenModal(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-amber-50/30">
      <MyItemsHeader onOpenModal={handleOpenModal} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MyItemsContent
          userId={user.id}
          searchParams={searchParams}
          openModal={shouldOpenModal}
        />
      </div>
    </div>
  );
}
