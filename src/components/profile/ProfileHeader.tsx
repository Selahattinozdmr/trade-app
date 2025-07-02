"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProfileHeaderProps {
  userEmail: string;
  userName?: string;
  userCreatedAt: string;
}

export function ProfileHeader({
  userEmail,
  userName,
  userCreatedAt,
}: ProfileHeaderProps) {
  const router = useRouter();
  const { signOut } = useAuth();

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
            className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            ← Geri
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {userEmail?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {userName || userEmail}
          </h2>
          <p className="text-gray-600">{userEmail}</p>
          <p className="text-sm text-gray-500">
            Üyelik: {new Date(userCreatedAt).toLocaleDateString("tr-TR")}
          </p>
        </div>
      </div>
    </div>
  );
}
