import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getItems } from "@/features/items/actions";
import { FilterBar } from "@/features/items/components/FilterBar";
import { ItemCard } from "@/features/items/components/ItemCard";
import { Header } from "@/features/items/components/Header";
import { CreateItemLink } from "@/components/items";
import type { PageProps, User, ItemFilters } from "@/types/app";

// Loading components
function ItemsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function ItemsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: ItemFilters = {};

  if (typeof params.city === "string" && params.city) {
    const cityId = parseInt(params.city);
    if (!isNaN(cityId)) {
      filters.city = cityId;
    }
  }
  if (typeof params.category === "string") {
    filters.category = params.category;
  }
  if (typeof params.search === "string") {
    filters.search = params.search;
  }

  const items = await getItems(filters);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            İlan bulunamadı
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Aradığınız kriterlere uygun ilan bulunmuyor. Filtreleri değiştirmeyi
            deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) =>
        item.is_deal ? null : <ItemCard key={item.id} item={item} />
      )}
    </div>
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    redirect("/sign-in");
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const user: User = {
    id: authUser.id,
    email: authUser.email!,
    display_name: authUser.user_metadata.display_name,
    phone: authUser.user_metadata.phone,
    full_name: profile?.full_name || authUser.user_metadata?.full_name,
    avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url,
    created_at: authUser.created_at,
  };

  // Get statistics from database
  const [
    { count: activeUsersCount },
    { count: activeItemsCount },
    { count: successfulTradesCount },
  ] = await Promise.all([
    // Count active users (users who have logged in within last 30 days)
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte(
        "updated_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      ),

    // Count active items
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("is_deal", false),

    // Count successful trades (items marked as deals)
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("is_deal", true),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <Header user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hoş Geldiniz!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Takas Go ile istediğiniz ürünleri bulun, ihtiyacınız olmayanları
            takasla değerlendirin.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Aktif Kullanıcı
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activeUsersCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Başarılı Takas
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {successfulTradesCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aktif İlan</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activeItemsCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Son İlanlar</h2>
            <CreateItemLink />
          </div>

          <Suspense fallback={<ItemsLoading />}>
            <ItemsContent searchParams={searchParams || Promise.resolve({})} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
