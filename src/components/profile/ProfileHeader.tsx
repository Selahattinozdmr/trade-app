"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { uploadAvatar, updateUserAvatar } from "@/utils/avatar";
import { useState, useRef, ChangeEvent, useEffect, useCallback } from "react";

interface ProfileHeaderProps {
  userEmail: string;
  userName?: string;
  userCreatedAt: string;
  avatarUrl?: string;
  userId: string;
}

export function ProfileHeader({
  userEmail,
  userName,
  userCreatedAt,
  avatarUrl,
  userId,
}: ProfileHeaderProps) {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>(
    undefined
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize avatar on component mount
  useEffect(() => {
    const initializeAvatar = async () => {
      try {
        // Get current user to check for custom avatar flag
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // If user has custom_avatar flag set to true, use the stored custom avatar
        if (
          user.user_metadata?.custom_avatar &&
          user.user_metadata?.custom_avatar_url
        ) {
          setCurrentAvatarUrl(user.user_metadata.custom_avatar_url);
        }
        // If no custom avatar but has Google avatar, use Google avatar
        else if (user.user_metadata?.avatar_url) {
          setCurrentAvatarUrl(user.user_metadata.avatar_url);
        }
        // If avatarUrl was passed as prop, use it as fallback
        else if (avatarUrl) {
          setCurrentAvatarUrl(avatarUrl);
        }
      } catch (error) {
        console.error("Error initializing avatar:", error);
        // Fall back to passed avatarUrl if there's an error
        if (avatarUrl) {
          setCurrentAvatarUrl(avatarUrl);
        }
      }
    };

    initializeAvatar();
  }, [supabase, userId, avatarUrl]);

  // Refresh avatar from server to get the latest version
  const refreshAvatar = useCallback(async () => {
    try {
      // Get current user to check for custom avatar
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // If user has custom_avatar flag set to true, use the stored custom avatar
      if (
        user.user_metadata?.custom_avatar &&
        user.user_metadata?.custom_avatar_url
      ) {
        setCurrentAvatarUrl(user.user_metadata.custom_avatar_url);
      }
      // If no custom avatar but has Google avatar, use Google avatar
      else if (user.user_metadata?.avatar_url) {
        setCurrentAvatarUrl(user.user_metadata.avatar_url);
      }
      // Fall back to passed avatarUrl
      else if (avatarUrl) {
        setCurrentAvatarUrl(avatarUrl);
      }
      // No avatar available
      else {
        setCurrentAvatarUrl(undefined);
      }
    } catch (error) {
      console.error("Error refreshing avatar:", error);
    }
  }, [supabase, avatarUrl]);

  // Refresh avatar on component mount to get the latest version

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir resim dosyası seçin.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadResult = await uploadAvatar(supabase, file, userId);
      if (!uploadResult.success) {
        alert(uploadResult.error || "Yükleme sırasında bir hata oluştu.");
        return;
      }

      const updateResult = await updateUserAvatar(
        supabase,
        userId,
        uploadResult.url!
      );
      if (!updateResult.success) {
        alert(
          updateResult.error || "Profil güncelleme sırasında bir hata oluştu."
        );
        return;
      }

      setCurrentAvatarUrl(uploadResult.url);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh to ensure we have the latest avatar URL
      await refreshAvatar();
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Profil resmi yüklenirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatarUrl) return;

    setIsUploading(true);

    try {
      // Clear the custom avatar fields and reset the custom_avatar flag
      // This will allow the Google avatar to show again
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          custom_avatar: false, // Reset flag so Google avatar can be used again
          custom_avatar_url: "", // Clear the custom avatar URL
        },
      });

      if (authError) {
        alert("Auth güncelleme hatası: " + authError.message);
        return;
      }

      // Refresh to get Google avatar back if available
      await refreshAvatar();
    } catch (error) {
      console.error("Avatar remove error:", error);
      alert("Profil resmi kaldırılırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Profilim</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => router.back()}
            className="cursor-pointer px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            ← Geri
          </button>
          {/* <button
            onClick={handleSignOut}
            className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Çıkış Yap
          </button> */}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group">
          <div
            className="w-20 h-20 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center text-white text-2xl font-bold cursor-pointer transition-opacity group-hover:opacity-75 "
            onClick={handleAvatarClick}
          >
            {currentAvatarUrl ? (
              <Image
                src={currentAvatarUrl}
                alt="Avatar"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              userEmail?.charAt(0).toUpperCase()
            )}
          </div>

          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleAvatarClick}
          >
            {isUploading ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {userName || userEmail}
          </h2>
          <p className="text-gray-600 truncate">{userEmail}</p>
          <p className="text-sm text-gray-500">
            Üyelik: {new Date(userCreatedAt).toLocaleDateString("tr-TR")}
          </p>

          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="cursor-pointer text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
            >
              {currentAvatarUrl ? "Resmi Değiştir" : "Resim Ekle"}
            </button>
            {currentAvatarUrl && (
              <>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                  className=" cursor-pointer text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  Resmi Kaldır
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
