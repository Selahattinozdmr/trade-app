"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { deleteUser, deleteItem } from "@/app/admin/actions";
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
  const router = useRouter();
  const { supabase } = useSupabase();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-orange-50/50 to-orange-100/50 backdrop-blur-lg border-b border-orange-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
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
              </div>
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
                className=" cursor-pointer group relative flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>👋</span>
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
              { id: "overview", label: "Genel Bakış", icon: "📊" },
              { id: "users", label: "Kullanıcılar", icon: "👥" },
              { id: "items", label: "Ürünler", icon: "📦" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "overview" | "users" | "items")
                }
                className={` cursor-pointer py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600 bg-orange-50/50"
                    : "border-transparent text-orange-400 hover:text-orange-600 hover:border-orange-300"
                }`}
              >
                <span>{tab.icon}</span>
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
                icon="👥"
                color="blue"
              />
              <StatCard
                title="Toplam Ürün"
                value={stats.totalItems}
                icon="📦"
                color="green"
              />
              <StatCard
                title="Admin Kullanıcı"
                value={stats.superAdminUsers}
                icon="🔐"
                color="purple"
              />
              <StatCard
                title="Aktif Ürün"
                value={stats.activeItems}
                icon="✅"
                color="orange"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-orange-200/50">
                <div className="px-6 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-semibold text-orange-800 mb-4 flex items-center">
                    <span className="mr-2">👤</span>
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
                  <h3 className="text-lg leading-6 font-semibold text-orange-800 mb-4 flex items-center">
                    <span className="mr-2">📦</span>
                    Son Ürünler
                  </h3>
                  <div className="space-y-4">
                    {items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-orange-50/50 rounded-xl transition-all duration-200 hover:bg-orange-100/50"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white">📦</span>
                        </div>
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
                <h3 className="text-lg leading-6 font-semibold text-orange-800 flex items-center">
                  <span className="mr-2">👥</span>
                  Kullanıcı Listesi
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-orange-600">
                  Tüm kayıtlı kullanıcılar ve rolleri
                </p>
              </div>
              <ul className="divide-y divide-orange-100">
                {users.map((user) => (
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
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={loading === user.id}
                            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                          >
                            {loading === user.id ? "Siliniyor..." : "Sil"}
                          </button>
                        )}
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
                <h3 className="text-lg leading-6 font-semibold text-orange-800 flex items-center">
                  <span className="mr-2">📦</span>
                  Ürün Listesi
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-orange-600">
                  Tüm ürünler ve durumları
                </p>
              </div>
              <ul className="divide-y divide-orange-100">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="px-6 py-4 sm:px-6 hover:bg-orange-50/50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-lg">📦</span>
                        </div>
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
                          className=" text-red-600 hover:text-red-800 text-sm disabled:opacity-50 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
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
  icon: string;
  color: "blue" | "green" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
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
              className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <span className="text-white text-xl">{icon}</span>
            </div>
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
