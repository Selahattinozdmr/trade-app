"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getUserItemsPaginated,
  deleteItem,
} from "@/features/items/client-actions";
import { UserItemCard } from "@/features/items/components/UserItemCard";
import { CreateItemModal } from "@/components/items";
import { Pagination } from "@/components/ui";
import type { Item } from "@/types/app";

interface MyItemsContentProps {
  userId: string;
  searchParams: Record<string, string | string[] | undefined>;
}

interface PaginatedItems {
  data: Item[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function MyItemsContent({ userId }: MyItemsContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [items, setItems] = useState<PaginatedItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPage = parseInt(urlSearchParams.get("page") || "1");

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserItemsPaginated(userId, {
        page: currentPage,
        limit: 12,
      });
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage]);

  useEffect(() => {
    loadItems();
  }, [userId, currentPage, loadItems]);

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg inline-block">
          {error}
        </div>
      </div>
    );
  }

  if (!items || items.data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-500"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Henüz İlan Yok
          </h3>
          <p className="text-gray-600 mb-6">
            Henüz hiç ilan yayınlamamışsınız. İlk ilanınızı oluşturmak için
            başlayın!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            İlk İlanını Oluştur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">
            {items.count}
          </div>
          <div className="text-sm text-gray-600">Toplam İlan</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-3xl font-bold text-green-500 mb-2">
            {items.data.filter((item: Item) => !item.is_deal).length}
          </div>
          <div className="text-sm text-gray-600">Aktif İlan</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-3xl font-bold text-gray-500 mb-2">
            {items.data.filter((item: Item) => item.is_deal).length}
          </div>
          <div className="text-sm text-gray-600">Pasif İlan</div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <Pagination
        currentPage={items.currentPage}
        totalPages={items.totalPages}
        hasNext={items.hasNext}
        hasPrev={items.hasPrev}
        onPageChange={handlePageChange}
      />

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
