"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  createItem,
  getCategories,
  getCities,
} from "@/features/items/client-actions";
import { uploadItemImage } from "@/utils/image-upload";
import type { CreateItemData, Category, City } from "@/types/app";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateItemModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateItemModalProps) {
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
    category_id: "",
    image_url: "",
    is_deal: false,
  });

  // Load categories and cities when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategoriesAndCities();
    }
  }, [isOpen]);

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

      // Upload image if a file is selected
      if (selectedFile) {
        setIsUploading(true);
        const uploadResult = await uploadItemImage(selectedFile);
        imageUrl = uploadResult.url;
        setIsUploading(false);
      }

      const itemData: CreateItemData = {
        title: formData.title,
        is_deal: formData.is_deal,
      };

      // Add optional fields only if they have values
      if (formData.description) {
        itemData.description = formData.description;
      }
      if (formData.category_id) {
        itemData.category_id = formData.category_id;
      }
      if (formData.city_id) {
        itemData.city_id = formData.city_id;
      }
      if (imageUrl) {
        itemData.image_url = imageUrl;
      }

      await createItem(itemData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category_id: "",
        image_url: "",
        is_deal: false,
      });
      setSelectedFile(null);
      setPreviewUrl(null);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item");
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
          : value === ""
          ? undefined
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
      setPreviewUrl(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni İlan Oluştur"
      size="lg"
    >
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
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="İlan başlığını girin"
          />
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
            value={formData.description}
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
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
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
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    const input = document.getElementById(
                      "image"
                    ) as HTMLInputElement;
                    if (input) input.value = "";
                  }}
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
          <Button type="submit" disabled={isLoading || !formData.title.trim()}>
            {isUploading
              ? "Resim yükleniyor..."
              : isLoading
              ? "Oluşturuluyor..."
              : "İlan Oluştur"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
