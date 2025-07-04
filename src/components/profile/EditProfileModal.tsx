"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { ProfileFormData } from "@/types/app";
import type { User } from "@supabase/supabase-js";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User; // Using Supabase user type
  onSave?: (data: ProfileFormData) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    display_name:
      user.user_metadata?.display_name || user.user_metadata?.full_name || "",
    phone: user.user_metadata?.phone || "",
    avatar_url: user.user_metadata?.avatar_url || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.display_name.trim()) {
      newErrors.display_name = "Görünen ad gereklidir";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası gereklidir";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      if (onSave) {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      setGeneralError(
        error instanceof Error
          ? error.message
          : "Profil güncellenirken hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profili Düzenle" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* General Error */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{generalError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Görünen Ad *
          </label>
          <input
            type="text"
            value={formData.display_name}
            onChange={(e) => handleInputChange("display_name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Görünen adınızı giriniz"
          />
          {errors.display_name && (
            <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefon Numarası *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Telefon numaranızı giriniz"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profil Resmi URL (Opsiyonel)
          </label>
          <input
            type="url"
            value={formData.avatar_url}
            onChange={(e) => handleInputChange("avatar_url", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="https://example.com/avatar.jpg"
          />
          {errors.avatar_url && (
            <p className="mt-1 text-sm text-red-600">{errors.avatar_url}</p>
          )}
        </div>

        {/* Preview */}
        {formData.avatar_url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Önizleme
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative rounded-full border border-gray-300 overflow-hidden">
                <Image
                  src={formData.avatar_url}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <span className="text-sm text-gray-600">
                {formData.display_name || "Görünen Ad"}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            İptal
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
