"use client";

import { useState } from "react";
import Image from "next/image";
import type { Item } from "@/types/app";
import { EditItemModal } from "@/components/items";

type Props = {
  item: Item;
  onUpdate?: () => void;
  onDelete?: () => void;
};

export function UserItemCard({ item, onUpdate, onDelete }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);

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
      month: "short",
      year: "numeric",
    });
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      onDelete?.();
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onUpdate?.();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.is_deal
                  ? "bg-gray-100 text-gray-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {item.is_deal ? "Pasif" : "Aktif"}
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-orange-600 rounded-full shadow-sm transition-colors cursor-pointer"
              title="Düzenle"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full shadow-sm transition-colors cursor-pointer"
              title="Sil"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Location and Category */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{getCityLabel()}</span>
            </div>

            <div className="flex items-center gap-1">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>{getCategoryLabel()}</span>
            </div>
          </div>

          {/* Date and Status */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {item.is_deal ? "İlan pasif durumda" : "Takas için uygun"}
            </div>

            <div className="text-xs text-gray-400">
              {formatDate(item.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditItemModal
          isOpen={showEditModal}
          item={item}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
