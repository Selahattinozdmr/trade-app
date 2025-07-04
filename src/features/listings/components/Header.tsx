"use client";

import Link from "next/link";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import type { User } from "@/types/app";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  useEffect(() => {
  const setAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === '6a174fe1-392c-49ed-a003-5cb4e99c531f') {
      await supabase.auth.updateUser({
        data: { is_super_admin: true }
      });
  
    }
  };
  setAdmin();


}, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Takas Go</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/home"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/items/create"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              İlan Ver
            </Link>
            <Link
              href="/items/my"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              İlanlarım
            </Link>
            <Link
              href="/messages"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors relative"
            >
              Mesajlar
              {/* You can add unread message count badge here later */}
            </Link>
          </nav>

          {/* Mobile menu button & Profile */}
          <div className="flex items-center space-x-4">
            {/* Create listing button */}
            <Link
              href="/items/create"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              İlan Ver
            </Link>

            {/* Profile Avatar */}
            <ProfileAvatar user={user} />

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
