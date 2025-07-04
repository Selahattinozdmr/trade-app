"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { uploadAvatar, updateUserAvatar } from "@/utils/avatar";
import { useState, useRef, ChangeEvent } from "react";

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
  const { signOut } = useAuth();
  const { supabase } = useSupabase();

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const updateResult = await updateUserAvatar(supabase, userId, "");
      if (!updateResult.success) {
        alert(updateResult.error || "Profil resmi kaldırma hatası.");
        return;
      }

      setCurrentAvatarUrl(undefined);
    } catch (error) {
      console.error("Avatar remove error:", error);
      alert("Profil resmi kaldırılırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
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
          <button
            onClick={handleSignOut}
            className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group">
          <div
            className="w-20 h-20 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center text-white text-2xl font-bold cursor-pointer transition-opacity group-hover:opacity-75"
            onClick={handleAvatarClick}
          >
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
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
          <p className="text-gray-600">{userEmail}</p>
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
