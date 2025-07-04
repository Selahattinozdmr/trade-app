import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import React from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "../../../components/profile/ProfileActions";
import { Header } from "@/features/items/components/Header";
import type { User } from "@/types/app";

interface Props {
  params: Promise<{ id: string }>;
}

const SingleUserPage = async ({ params }: Props) => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const currentUserId = user.id;

  // Check if user is viewing their own profile or someone else's
  const isOwnProfile = id === currentUserId;

  // For now, only allow users to view their own profiles
  if (!isOwnProfile) {
    notFound();
  }

  // Fetch user's items count
  const { count: itemsCount } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get user profile data for header
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userForHeader: User = {
    id: user.id,
    email: user.email!,
    display_name: user.user_metadata.display_name,
    phone: user.user_metadata.phone,
    full_name: profile?.full_name || user.user_metadata?.full_name,
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
    created_at: user.created_at,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <Header user={userForHeader} />

      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ProfileHeader
            userEmail={user.email!}
            userName={
              user.user_metadata?.display_name || user.user_metadata?.full_name
            }
            userCreatedAt={user.created_at}
            avatarUrl={user.user_metadata?.avatar_url}
            userId={user.id}
          />

          {/* User Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Hesap Bilgileri
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı ID
                </label>
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm">
                  {user.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {user.user_metadata?.phone || user.phone || "Belirtilmemiş"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toplam İlan
                </label>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-800">{itemsCount || 0} adet</span>
                  {(itemsCount || 0) === 0 && (
                    <span className="text-sm text-orange-600 font-medium">
                      İlk ilanınızı oluşturun!
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Doğrulandı
                </label>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.email_confirmed_at
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.email_confirmed_at ? "Doğrulandı" : "Beklemede"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Son Giriş
                </label>
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString("tr-TR")
                    : "Bilinmiyor"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <ProfileActions user={user} />
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
