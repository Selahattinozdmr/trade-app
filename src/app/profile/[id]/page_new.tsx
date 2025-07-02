import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import React from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

interface Props {
  params: { id: string };
}

const SingleUserPage = async ({ params }: Props) => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = params;
  const currentUserId = session.user.id;

  // Check if user is viewing their own profile or someone else's
  const isOwnProfile = id === currentUserId;

  // For now, only allow users to view their own profiles
  if (!isOwnProfile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ProfileHeader
          userEmail={session.user.email!}
          userName={session.user.user_metadata?.full_name}
          userCreatedAt={session.user.created_at}
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
                {session.user.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                {session.user.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Doğrulandı
              </label>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  session.user.email_confirmed_at
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {session.user.email_confirmed_at ? "Doğrulandı" : "Beklemede"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Son Giriş
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                {session.user.last_sign_in_at
                  ? new Date(session.user.last_sign_in_at).toLocaleString(
                      "tr-TR"
                    )
                  : "Bilinmiyor"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Hesap İşlemleri
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <h4 className="font-semibold text-gray-800 mb-2">
                Profili Düzenle
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Profil bilgilerinizi güncelleyin
              </p>
              <span className="text-sm text-orange-600 font-medium">
                Yakında...
              </span>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <h4 className="font-semibold text-gray-800 mb-2">Takaslarım</h4>
              <p className="text-sm text-gray-600 mb-3">
                Aktif ve geçmiş takaslarınızı görün
              </p>
              <span className="text-sm text-orange-600 font-medium">
                Yakında...
              </span>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <h4 className="font-semibold text-gray-800 mb-2">Ayarlar</h4>
              <p className="text-sm text-gray-600 mb-3">
                Hesap ayarlarınızı yönetin
              </p>
              <span className="text-sm text-orange-600 font-medium">
                Yakında...
              </span>
            </div>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Geliştirici Bilgileri
          </h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(session.user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
