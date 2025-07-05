import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserConversations } from "@/features/messages";
import { ConversationList } from "@/features/messages/components/ConversationList";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import type { User } from "@/types/app";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mesajlar - Takas Go",
  description: "İletişim kurduğunuz kullanıcılarla mesajlaşın",
};

// Loading component for conversations
function ConversationsLoading() {
  return (
    <div className="h-full p-4">
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-4 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function ConversationListWrapper({ user }: { user: User }) {
  const result = await getUserConversations(user.id);

  if (!result.success) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-sm">Konuşmalar yüklenirken hata oluştu</p>
          <p className="text-xs text-gray-400 mt-1">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <ConversationList
      conversations={result.data || []}
      currentUserId={user.id}
    />
  );
}

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Convert Supabase user to app User type
  const appUser: User = {
    id: user.id,
    email: user.email || "",
    created_at: user.created_at || "",
    full_name: user.user_metadata?.full_name,
    display_name: user.user_metadata?.display_name,
    phone: user.user_metadata?.phone,
    avatar_url: user.user_metadata?.avatar_url,
    ...(user.email_confirmed_at && {
      email_confirmed_at: user.email_confirmed_at,
    }),
    ...(user.last_sign_in_at && { last_sign_in_at: user.last_sign_in_at }),
    user_metadata: user.user_metadata,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-orange-100/50 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href={`/messages`} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
                <p className="text-gray-600">
                  İletişim kurduğunuz kullanıcılarla mesajlaşın
                </p>
              </div>
            </Link>

            {/* User Profile Avatar */}
            <ProfileAvatar user={appUser} />
          </div>
        </div>
      </div>{" "}
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div
          className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm overflow-hidden relative z-10"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="lg:col-span-1 border-r border-gray-200 relative z-10">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Konuşmalar
                </h2>
              </div>
              <Suspense fallback={<ConversationsLoading />}>
                <ConversationListWrapper user={appUser} />
              </Suspense>
            </div>

            {/* Empty State */}
            <div className="lg:col-span-2 hidden lg:flex items-center justify-center bg-gray-50 relative z-10">
              <div className="text-center text-gray-500">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Bir konuşma seçin
                </h3>
                <p className="text-sm text-gray-500">
                  Sol taraftan bir konuşma seçerek mesajlaşmaya başlayın
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
