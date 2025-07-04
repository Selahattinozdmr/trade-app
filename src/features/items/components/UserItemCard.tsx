"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${
                item.is_deal
                  ? "bg-gray-900/80 text-white"
                  : "bg-green-500/90 text-white"
              }`}
            >
              {item.is_deal ? "Pasif" : "Aktif"}
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdit();
              }}
              className="cursor-pointer p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-orange-600 rounded-xl shadow-sm transition-all duration-200 hover:scale-110"
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-600 rounded-xl shadow-sm transition-all duration-200 hover:scale-110 cursor-pointer"
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

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
            <Link
              href={`/items/${item.id}`}
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl pointer-events-auto"
            >
              Detayları Gör
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
              {item.title}
            </h3>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
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
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {getCategoryLabel()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {formatDate(item.created_at)}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditItemModal
          item={item}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
