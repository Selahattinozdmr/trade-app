"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getUserItemsPaginated,
  deleteItem,
  getCategories,
} from "@/features/items/client-actions";
import { UserItemCard } from "@/features/items/components/UserItemCard";
import { CreateItemModal } from "@/components/items";
import { Pagination } from "@/components/ui";
import type { Item, Category } from "@/types/app";

interface MyItemsContentProps {
  userId: string;
  searchParams: Record<string, string | string[] | undefined>;
  openModal?: boolean;
}

interface PaginatedItems {
  data: Item[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function MyItemsContent({ userId, openModal }: MyItemsContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [items, setItems] = useState<PaginatedItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const currentPage = parseInt(urlSearchParams.get("page") || "1");

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    setSearch(urlSearchParams.get("search") || "");
    setStatus(urlSearchParams.get("status") || "");
    setCategory(urlSearchParams.get("category") || "");
  }, [urlSearchParams]);

  // Handle external modal trigger
  useEffect(() => {
    if (openModal) {
      setIsModalOpen(true);
    }
  }, [openModal]);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParam = urlSearchParams.get("search");
      const statusParam = urlSearchParams.get("status");
      const categoryParam = urlSearchParams.get("category");

      const result = await getUserItemsPaginated(userId, {
        page: currentPage,
        limit: 12,
        ...(searchParam && { search: searchParam }),
        ...(statusParam && { status: statusParam }),
        ...(categoryParam && { category: categoryParam }),
      });
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, urlSearchParams]);

  useEffect(() => {
    loadItems();
  }, [userId, currentPage, loadItems]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (category) params.set("category", category);

    const queryString = params.toString();
    router.push(`/items/my${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    router.push("/items/my");
  };

  const hasActiveFilters = search || status || category;

  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((c) => c.id === categoryId)?.name || "Bilinmeyen Kategori"
    );
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    router.push(`/items/my${queryString ? `?${queryString}` : ""}`);
  };

  const handleItemUpdate = () => {
    loadItems();
  };

  const handleItemDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      loadItems(); // Refresh the list
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silme işlemi başarısız oldu");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Quick Stats Loading */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>

        {/* Search and filters loading */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-3 flex-1">
                <div className="h-10 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-36 animate-pulse"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-28 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-red-100 p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Bir Hata Oluştu
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadItems}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!items || items.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-12 max-w-lg mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M8 4V3a1 1 0 011-1h2a1 1 0 011 1v1"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            İlk İlanınızı Oluşturun
          </h3>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Henüz hiç ilan yayınlamamışsınız. Eşyalarınızı paylaşarak takas
            yapmaya başlayın!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className=" cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-sm"
          >
            İlk İlanımı Oluştur
          </button>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              💡 İpucu: Kaliteli fotoğraflar ve detaylı açıklamalar ilanınızın
              daha çok beğenilmesini sağlar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {items.count}
          </div>
          <div className="text-sm text-gray-600">Toplam İlan</div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
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
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {items.data.filter((item: Item) => !item.is_deal).length}
          </div>
          <div className="text-sm text-gray-600">Aktif İlan</div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {items.data.filter((item: Item) => item.is_deal).length}
          </div>
          <div className="text-sm text-gray-600">Tamamlanan</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3 flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="İlan ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-48"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="cursor-pointer px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="completed">Tamamlanan</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={categoriesLoading}
                className=" cursor-pointer px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((categoryOption) => (
                  <option key={categoryOption.id} value={categoryOption.id}>
                    {categoryOption.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={applyFilters}
                className=" cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                Filtrele
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className=" cursor-pointer px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Temizle
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  Arama: &quot;{search}&quot;
                  <button
                    onClick={() => {
                      setSearch("");
                      // Update URL immediately
                      const params = new URLSearchParams(
                        urlSearchParams.toString()
                      );
                      params.delete("search");
                      const queryString = params.toString();
                      router.push(
                        `/items/my${queryString ? `?${queryString}` : ""}`
                      );
                    }}
                    className="ml-2 text-orange-600 hover:text-orange-800 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Durum: {status === "active" ? "Aktif" : "Tamamlanan"}
                  <button
                    onClick={() => {
                      setStatus("");
                      // Update URL immediately
                      const params = new URLSearchParams(
                        urlSearchParams.toString()
                      );
                      params.delete("status");
                      const queryString = params.toString();
                      router.push(
                        `/items/my${queryString ? `?${queryString}` : ""}`
                      );
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Kategori: {getCategoryName(category)}
                  <button
                    onClick={() => {
                      setCategory("");
                      // Update URL immediately
                      const params = new URLSearchParams(
                        urlSearchParams.toString()
                      );
                      params.delete("category");
                      const queryString = params.toString();
                      router.push(
                        `/items/my${queryString ? `?${queryString}` : ""}`
                      );
                    }}
                    className="ml-2 text-green-600 hover:text-green-800 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.data.map((item: Item) => (
          <UserItemCard
            key={item.id}
            item={item}
            onUpdate={handleItemUpdate}
            onDelete={() => handleItemDelete(item.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {items.totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            currentPage={items.currentPage}
            totalPages={items.totalPages}
            hasNext={items.hasNext}
            hasPrev={items.hasPrev}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Create Item Modal */}
      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          loadItems();
        }}
      />
    </div>
  );
}
