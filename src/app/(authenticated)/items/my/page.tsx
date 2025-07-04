import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MyItemsClientWrapper } from "./MyItemsClientWrapper";
import type { PageProps, User } from "@/types/app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İlanlarım - Takas Go",
  description: "Yayınladığınız tüm ilanları görüntüleyin ve yönetin",
};

// Loading component
function MyItemsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Modern compact header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl animate-pulse"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded-lg w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Filters and search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="h-10 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-28 animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded-xl w-10 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-10 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-5">
                <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-9 bg-gray-200 rounded-xl flex-1"></div>
                  <div className="h-9 bg-gray-200 rounded-xl w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function MyItemsPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Await searchParams before passing it down
  const resolvedSearchParams = await searchParams;

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
    <Suspense fallback={<MyItemsLoading />}>
      <MyItemsClientWrapper
        user={appUser}
        searchParams={resolvedSearchParams || {}}
      />
    </Suspense>
  );
}

export default MyItemsPage;
