"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getCategories, getCities } from "@/features/items/client-actions";
import type { Category, City } from "@/types/app";

export function FilterBar() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  // Load categories and cities on mount
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const [categoriesData, citiesData] = await Promise.all([
          getCategories(),
          getCities(),
        ]);
        setCategories(categoriesData);
        setCities(citiesData);
      } catch (error) {
        console.error("Error loading filter data:", error);
        setError("Filtre verileri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadFiltersData();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    setSearch(params.get("search") || "");
    setCity(params.get("city") || "");
    setCategory(params.get("category") || "");
  }, [params]);

  const applyFilters = () => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (city) query.set("city", city);
    if (category) query.set("category", category);

    const queryString = query.toString();
    router.push(`/home${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setCategory("");
    router.push("/home");
  };

  const hasActiveFilters = search || city || category;

  const getCityName = (cityId: string) => {
    const cityIdNum = parseInt(cityId);
    return cities.find((c) => c.id === cityIdNum)?.name || "Bilinmeyen Şehir";
  };

  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((c) => c.id === categoryId)?.name || "Bilinmeyen Kategori"
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Filtreler yükleniyor...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                // Retry loading
                window.location.reload();
              }}
              className="mt-2 text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Tekrar dene
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"
              placeholder="İlan ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-4">
            {/* City filter */}
            <div className="flex-1 min-w-[200px]">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white cursor-pointer"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
              >
                <option value="">Tüm Şehirler</option>
                {cities.map((cityOption) => (
                  <option key={cityOption.id} value={cityOption.id.toString()}>
                    {cityOption.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div className="flex-1 min-w-[200px]">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((categoryOption) => (
                  <option
                    key={categoryOption.id}
                    value={categoryOption.id}
                    className="cursor-pointer"
                  >
                    {categoryOption.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
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
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Temizle
                </button>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  Arama: &quot;{search}&quot;
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 text-orange-600 hover:text-orange-800 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {city && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Şehir: {getCityName(city)}
                  <button
                    onClick={() => setCity("")}
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
                    onClick={() => setCategory("")}
                    className="ml-2 text-green-600 hover:text-green-800 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
