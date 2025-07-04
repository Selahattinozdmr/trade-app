"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditProfileModal } from "./EditProfileModal";
import { UserItemsModal } from "./UserItemsModal";
import { SettingsModal } from "./SettingsModal";
import { updateProfile } from "@/features/profile/actions";
import type { ProfileFormData } from "@/types/app";
import type { User } from "@supabase/supabase-js";

interface ProfileActionsProps {
  user: User; // Using Supabase user type
  onProfileUpdate?: (data: ProfileFormData) => Promise<void>;
}

export function ProfileActions({ user, onProfileUpdate }: ProfileActionsProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const router = useRouter();

  const handleProfileSave = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(user.id, data);

      if (!result.success) {
        throw new Error(result.error || "Profile update failed");
      }

      // Call the optional callback if provided
      if (onProfileUpdate) {
        await onProfileUpdate(data);
      }

      // Refresh the page to show updated data
      router.refresh();

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const actions = [
    {
      title: "Profili Düzenle",
      description: "Profil bilgilerinizi güncelleyin",
      action: () => setEditModalOpen(true),
      icon: (
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      title: "Takaslarım",
      description: "Aktif ve geçmiş takaslarınızı görün",
      action: () => setItemsModalOpen(true),
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      title: "Ayarlar",
      description: "Hesap ayarlarınızı yönetin",
      action: () => setSettingsModalOpen(true),
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Hesap İşlemleri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <button
              key={action.title}
              onClick={action.action}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-left group cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-orange-500 group-hover:text-orange-600 transition-colors">
                  {action.icon}
                </div>
                <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {action.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
              <span className="text-sm text-orange-600 font-medium group-hover:text-orange-700 transition-colors">
                Aç →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onSave={handleProfileSave}
      />

      <UserItemsModal
        isOpen={itemsModalOpen}
        onClose={() => setItemsModalOpen(false)}
        userId={user.id}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        userEmail={user.email!}
      />
    </>
  );
}
