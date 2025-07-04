import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MyItemsContent } from "./MyItemsContent";
import { Header } from "@/features/items/components/Header";
import type { PageProps, User } from "@/types/app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İlanlarım - Takas Go",
  description: "Yayınladığınız tüm ilanları görüntüleyin ve yönetin",
};

// Loading component
function MyItemsLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF4E6" }}>
      {/* Header Loading */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Loading */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
    email: user.email || '',
    created_at: user.created_at || '',
    full_name: user.user_metadata?.full_name,
    display_name: user.user_metadata?.display_name,
    phone: user.user_metadata?.phone,
    avatar_url: user.user_metadata?.avatar_url,
    ...(user.email_confirmed_at && { email_confirmed_at: user.email_confirmed_at }),
    ...(user.last_sign_in_at && { last_sign_in_at: user.last_sign_in_at }),
    user_metadata: user.user_metadata,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF4E6" }}>
      {/* Header */}
      <Header user={appUser} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Suspense fallback={<MyItemsLoading />}>
          <MyItemsContent
            userId={user.id}
            searchParams={resolvedSearchParams || {}}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default MyItemsPage;
