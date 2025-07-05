import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getItemById } from "@/features/items/actions";
import { Header } from "@/features/items/components/Header";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/app";

interface Props {
  params: Promise<{ itemId: string }>;
}

// Loading component for the item details
function ItemLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
        <div className="aspect-[16/9] bg-gray-200" />
        <div className="p-8">
          <div className="h-8 bg-gray-200 rounded mb-4" />
          <div className="h-6 bg-gray-200 rounded mb-6 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function ItemContent({
  itemId,
  currentUserId,
}: {
  itemId: string;
  currentUserId: string;
}) {
  const item = await getItemById(itemId);

  if (!item) {
    notFound();
  }

  const getCategoryLabel = () => {
    return item.categories?.name || "Kategori belirtilmemiş";
  };

  const getCityLabel = () => {
    return item.cities?.name || "Şehir belirtilmemiş";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="relative aspect-[16/9] bg-gray-100">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-24 h-24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-6 right-6">
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${
                item.is_deal
                  ? "bg-gray-100 text-gray-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {item.is_deal ? "Pasif" : "Aktif"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {item.title}
          </h1>

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Açıklama
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Location */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Konum</p>
                <p className="font-semibold text-gray-900">{getCityLabel()}</p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                <p className="font-semibold text-gray-900">
                  {getCategoryLabel()}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Yayınlanma Tarihi</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(item.created_at)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Durum</p>
                <p className="font-semibold text-gray-900">
                  {item.is_deal ? "İlan pasif durumda" : "Takas için uygun"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            {currentUserId !== item.user_id ? (
              <Link
                href={`/messages/${item.user_id}`}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
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
                <span>İletişime Geç</span>
              </Link>
            ) : (
              <div className="flex-1 bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Kendi İlanın</span>
              </div>
            )}

            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Favorilere Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ItemPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const { itemId } = await params;

  // Get user profile data for header
  const userForHeader: User = {
    id: user.id,
    email: user.email!,
    display_name: user.user_metadata.display_name,
    phone: user.user_metadata.phone,
    full_name: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
    created_at: user.created_at,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <Header user={userForHeader} />

      <div className="p-4">
        <Suspense fallback={<ItemLoading />}>
          <ItemContent itemId={itemId} currentUserId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
