"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import {
  deleteUser,
  deleteItem,
  makeAdmin,
  removeAdmin,
} from "@/app/admin/actions";
import type { User } from "@supabase/supabase-js";
import type { AdminStats, AdminUser, AdminItem } from "@/types/admin";

interface AdminDashboardProps {
  users: AdminUser[];
  items: AdminItem[];
  stats: AdminStats;
  currentUser: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users: initialUsers,
  items: initialItems,
  stats: initialStats,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "items">(
    "overview"
  );
  const [users, setUsers] = useState(initialUsers);
  const [items, setItems] = useState(initialItems);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState<string | null>(null);

  // Filter and search states
  const [userSearch, setUserSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [itemCategoryFilter, setItemCategoryFilter] = useState("");
  const [itemStatusFilter, setItemStatusFilter] = useState("");

  const router = useRouter();
  const { supabase } = useSupabase();

  // Filtered data
  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(userSearch.toLowerCase()) || false
  );

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.category?.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.user_email?.toLowerCase().includes(itemSearch.toLowerCase());
    const matchesCategory =
      !itemCategoryFilter || item.category === itemCategoryFilter;
    const matchesStatus = !itemStatusFilter || item.status === itemStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories and statuses for filters
  const itemCategories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ] as string[];
  const itemStatuses = [
    ...new Set(items.map((item) => item.status || "draft")),
  ] as string[];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/sign-in");
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(userId);
    try {
      const result = await deleteUser(userId);

      if (result.success) {
        // Update local state
        setUsers(users.filter((user) => user.id !== userId));
        setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        alert("Kullanıcı başarıyla silindi");
      } else {
        throw new Error(result.error || "Kullanıcı silinirken hata oluştu");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Kullanıcı silinirken hata oluştu: " + (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(itemId);
    try {
      const result = await deleteItem(itemId);

      if (result.success) {
        // Update local state
        setItems(items.filter((item) => item.id !== itemId));
        setStats((prev) => ({ ...prev, totalItems: prev.totalItems - 1 }));
        alert("Ürün başarıyla silindi");
      } else {
        throw new Error(result.error || "Ürün silinirken hata oluştu");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Ürün silinirken hata oluştu: " + (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı admin yapmak istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(`admin-${userId}`);
    try {
      const result = await makeAdmin(userId);

      if (result.success) {
        // Update local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: "admin" } : user
          )
        );
        setStats((prev) => ({
          ...prev,
          superAdminUsers: prev.superAdminUsers + 1,
        }));
        alert("Kullanıcı başarıyla admin yapıldı");
      } else {
        throw new Error(
          result.error || "Kullanıcı admin yapılırken hata oluştu"
        );
      }
    } catch (error) {
      console.error("Error making user admin:", error);
      alert(
        "Kullanıcı admin yapılırken hata oluştu: " + (error as Error).message
      );
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (
      !confirm(
        "Bu kullanıcının admin yetkisini kaldırmak istediğinizden emin misiniz?"
      )
    ) {
      return;
    }

    setLoading(`remove-admin-${userId}`);
    try {
      const result = await removeAdmin(userId);

      if (result.success) {
        // Update local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: "user" } : user
          )
        );
        setStats((prev) => ({
          ...prev,
          superAdminUsers: Math.max(0, prev.superAdminUsers - 1),
        }));
        alert("Kullanıcının admin yetkisi başarıyla kaldırıldı");
      } else {
        throw new Error(
          result.error || "Admin yetkisi kaldırılırken hata oluştu"
        );
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      alert(
        "Admin yetkisi kaldırılırken hata oluştu: " + (error as Error).message
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-orange-50/50 to-orange-100/50 backdrop-blur-lg border-b border-orange-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("overview")}
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Takas Go
                  </h1>
                  <p className="text-xs text-orange-500 font-medium -mt-1">
                    Admin Panel
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center space-x-6">
              {/* User Info */}
              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-orange-200/50 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {currentUser.email?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-orange-800">Admin</p>
                  <p className="text-xs text-orange-600 -mt-1">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="cursor-pointer group relative flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Çıkış Yap</span>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Genel Bakış" },
              { id: "users", label: "Kullanıcılar" },
              { id: "items", label: "Ürünler" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "overview" | "users" | "items")
                }
                className={`cursor-pointer py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-orange-400 hover:text-orange-600 hover:border-orange-300"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "overview" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Toplam Kullanıcı"
                value={stats.totalUsers}
                color="blue"
              />
              <StatCard
                title="Toplam Ürün"
                value={stats.totalItems}
                color="green"
              />
              <StatCard
                title="Admin Kullanıcı"
                value={stats.superAdminUsers}
                color="purple"
              />
              <StatCard
                title="Aktif Ürün"
                value={stats.activeItems}
                color="orange"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-orange-200/50">
                <div className="px-6 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-semibold text-orange-800 mb-4">
                    Son Kullanıcılar
                  </h3>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-3 bg-orange-50/50 rounded-xl transition-all duration-200 hover:bg-orange-100/50"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-900">
                            {user.email}
                          </p>
                          <p className="text-xs text-orange-600">
                            {new Date(user.created_at).toLocaleDateString(
                              "tr-TR"
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-orange-100 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-orange-200/50">
                <div className="px-6 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-semibold text-orange-800 mb-4">
                    Son Ürünler
                  </h3>
                  <div className="space-y-4">
                    {items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-orange-50/50 rounded-xl transition-all duration-200 hover:bg-orange-100/50"
                      >
                        {item.image_url ? (
                          <div className="w-10 h-10 relative rounded-full shadow-md overflow-hidden">
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                            <svg
                              className="w-5 h-5 text-white"
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
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-orange-600">
                            {item.category} •{" "}
                            {new Date(item.created_at).toLocaleDateString(
                              "tr-TR"
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {item.status || "draft"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-2xl border border-orange-200/50">
              <div className="px-6 py-5 sm:px-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                <h3 className="text-lg leading-6 font-semibold text-orange-800">
                  Kullanıcı Listesi
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-orange-600">
                  Tüm kayıtlı kullanıcılar ve rolleri
                </p>

                {/* User Search Bar */}
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-orange-400"
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
                      className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-orange-400 bg-white/70"
                      placeholder="Kullanıcı ara (e-posta)..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>

                  {/* Results Count */}
                  <div className="mt-2 text-sm text-orange-600">
                    {filteredUsers.length} kullanıcı gösteriliyor (toplam{" "}
                    {users.length})
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-orange-100">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="px-6 py-4 sm:px-6 hover:bg-orange-50/50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-orange-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-orange-600">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium border ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : "bg-orange-100 text-orange-700 border-orange-200"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                        <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                          {new Date(user.created_at).toLocaleDateString(
                            "tr-TR"
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Admin Role Management Buttons */}
                          {user.id !== currentUser.id && (
                            <>
                              {user.role === "admin" ? (
                                <button
                                  onClick={() => handleRemoveAdmin(user.id)}
                                  disabled={
                                    loading === `remove-admin-${user.id}`
                                  }
                                  className="text-yellow-600 hover:text-yellow-800 text-sm disabled:opacity-50 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                                >
                                  {loading === `remove-admin-${user.id}`
                                    ? "Kaldırılıyor..."
                                    : "Admin Kaldır"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleMakeAdmin(user.id)}
                                  disabled={loading === `admin-${user.id}`}
                                  className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                                >
                                  {loading === `admin-${user.id}`
                                    ? "Yapılıyor..."
                                    : "Admin Yap"}
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={loading === user.id}
                                className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                              >
                                {loading === user.id ? "Siliniyor..." : "Sil"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "items" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-2xl border border-orange-200/50">
              <div className="px-6 py-5 sm:px-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                <h3 className="text-lg leading-6 font-semibold text-orange-800">
                  Ürün Listesi
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-orange-600">
                  Tüm ürünler ve durumları
                </p>

                {/* Item Filters */}
                <div className="mt-4 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-orange-400"
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
                      className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-orange-400 bg-white/70"
                      placeholder="Ürün ara (başlık, kategori, kullanıcı)..."
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                    />
                  </div>

                  {/* Category and Status Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-orange-700 mb-1">
                        Kategori
                      </label>
                      <select
                        value={itemCategoryFilter}
                        onChange={(e) => setItemCategoryFilter(e.target.value)}
                        className="block w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/70 text-orange-800"
                      >
                        <option value="">Tüm Kategoriler</option>
                        {itemCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-orange-700 mb-1">
                        Durum
                      </label>
                      <select
                        value={itemStatusFilter}
                        onChange={(e) => setItemStatusFilter(e.target.value)}
                        className="block w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/70 text-orange-800"
                      >
                        <option value="">Tüm Durumlar</option>
                        {itemStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status === "active"
                              ? "Aktif"
                              : status === "draft"
                              ? "Taslak"
                              : status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(itemSearch || itemCategoryFilter || itemStatusFilter) && (
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setItemSearch("");
                            setItemCategoryFilter("");
                            setItemStatusFilter("");
                          }}
                          className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors duration-200"
                        >
                          Filtreleri Temizle
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-orange-600">
                    {filteredItems.length} ürün gösteriliyor (toplam{" "}
                    {items.length})
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-orange-100">
                {filteredItems.map((item) => (
                  <li
                    key={item.id}
                    className="px-6 py-4 sm:px-6 hover:bg-orange-50/50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {item.image_url ? (
                          <div className="w-12 h-12 relative rounded-full shadow-md overflow-hidden">
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                            <svg
                              className="w-6 h-6 text-white"
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
                        <div className="ml-4">
                          <div className="text-sm font-medium text-orange-900">
                            {item.title}
                          </div>
                          <div className="text-sm text-orange-600">
                            {item.category} • {item.user_email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium border ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {item.status || "draft"}
                        </span>
                        <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                          {new Date(item.created_at).toLocaleDateString(
                            "tr-TR"
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={loading === item.id}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                          {loading === item.id ? "Siliniyor..." : "Sil"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  color: "blue" | "green" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  const colorClasses = {
    blue: "from-blue-400 to-blue-500",
    green: "from-green-400 to-green-500",
    purple: "from-purple-400 to-purple-500",
    orange: "from-orange-400 to-orange-500",
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-orange-200/50 hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-3 h-12 bg-gradient-to-b ${colorClasses[color]} rounded-lg shadow-lg`}
            ></div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-orange-600 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-orange-900">
                {value.toLocaleString("tr-TR")}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
