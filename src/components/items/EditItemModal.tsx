"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  updateItem,
  getCategories,
  getCities,
} from "@/features/items/client-actions";
import { uploadItemImage } from "@/utils/image-upload";
import type { Item, CreateItemData, Category, City } from "@/types/app";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item: Item;
}

export function EditItemModal({
  isOpen,
  onClose,
  onSuccess,
  item,
}: EditItemModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateItemData>({
    title: "",
    description: "",
    short_description: "",
    category_id: "",
    image_url: "",
    is_deal: false,
  });

  // Initialize form data with item values when modal opens
  useEffect(() => {
    if (isOpen && item) {
      const formInitialData: CreateItemData = {
        title: item.title,
        description: item.description || "",
        short_description: item.short_description || "",
        category_id: item.category_id || "",
        image_url: item.image_url || "",
        is_deal: item.is_deal,
      };

      // Only add city_id if it exists
      if (item.city_id) {
        formInitialData.city_id = item.city_id;
      }

      setFormData(formInitialData);
      setPreviewUrl(item.image_url || null);
      loadCategoriesAndCities();
    }
  }, [isOpen, item]);

  const loadCategoriesAndCities = async () => {
    try {
      const [categoriesData, citiesData] = await Promise.all([
        getCategories(),
        getCities(),
      ]);
      setCategories(categoriesData);
      setCities(citiesData);
    } catch (err) {
      console.error("Error loading categories and cities:", err);
      setError("Failed to load form data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if a file is selected
      if (selectedFile) {
        setIsUploading(true);
        const uploadResult = await uploadItemImage(selectedFile);
        imageUrl = uploadResult.url;
        setIsUploading(false);
      }

      const itemData: Partial<CreateItemData> = {
        title: formData.title,
        is_deal: formData.is_deal,
      };

      // Add optional fields only if they have values
      if (formData.description && formData.description.trim()) {
        itemData.description = formData.description;
      }
      if (formData.short_description && formData.short_description.trim()) {
        itemData.short_description = formData.short_description;
      }
      if (formData.category_id && formData.category_id.trim()) {
        itemData.category_id = formData.category_id;
      }
      if (formData.city_id) {
        itemData.city_id = formData.city_id;
      }
      if (imageUrl) {
        itemData.image_url = imageUrl;
      }

      await updateItem(item.id, itemData);

      // Reset selected file
      setSelectedFile(null);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
      setIsUploading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "city_id"
          ? value
            ? parseInt(value)
            : undefined
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      // Reset to original image if file is cleared
      setPreviewUrl(item.image_url || null);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
    const input = document.getElementById("image") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="İlanı Düzenle" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Başlık *
          </label>
          <span className="text-gray-500 text-xs ml-1">
            (maks. 50 karakter)
          </span>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title || ""}
            maxLength={50}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="İlan başlığını girin"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {(formData.title || "").length}/50
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="short_description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kısa Açıklama
            <span className="text-gray-500 text-xs ml-1">
              (maks. 100 karakter)
            </span>
          </label>
          <input
            type="text"
            id="short_description"
            name="short_description"
            maxLength={100}
            value={formData.short_description || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="İlan için kısa bir açıklama girin"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {(formData.short_description || "").length}/100
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="İlan açıklamasını girin"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category_id"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kategori
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Kategori seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city_id"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Şehir
          </label>
          <select
            id="city_id"
            name="city_id"
            value={formData.city_id || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Şehir seçin</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Resim
          </label>
          <div className="space-y-4">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />

            {/* Image Preview */}
            {previewUrl && (
              <div className="relative">
                <div className="w-32 h-32 relative rounded-lg border border-gray-300 overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Maksimum 5MB boyutunda JPG, PNG veya GIF dosyası
              yükleyebilirsiniz.
            </p>
          </div>
        </div>

        {/* Deal Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_deal"
              checked={formData.is_deal}
              onChange={handleInputChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Takas tamamlandı olarak işaretle
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isLoading || !formData.title?.trim()}>
            {isUploading
              ? "Resim yükleniyor..."
              : isLoading
              ? "Güncelleniyor..."
              : "Güncelle"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
