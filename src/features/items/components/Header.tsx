"use client";

import Link from "next/link";
import { useState } from "react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { SettingsModal } from "@/components/profile/SettingsModal";
import { CreateItemLink } from "@/components/items/CreateItemLink";
import { CreateItemMobileNav } from "@/components/items/CreateItemMobileNav";
import type { User } from "@/types/app";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
    closeMobileMenu(); // Close mobile menu if open
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <>
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
              <CreateItemLink />

              {/* Profile Avatar */}
              <ProfileAvatar user={user} />

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
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
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMobileMenu}
        />

        {/* Mobile menu sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ProfileAvatar user={user} />
                <div>
                  <p className="font-medium text-gray-900">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-sm text-gray-500">Profil</p>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-6 space-y-2">
              <Link
                href="/home"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-3 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Ana Sayfa</span>
              </Link>
              <CreateItemMobileNav onClose={closeMobileMenu} />
              <Link
                href="/items/my"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-3 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
                <span>İlanlarım</span>
              </Link>
              <Link
                href="/messages"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-3 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Mesajlar</span>
              </Link>
            </nav>

            {/* Bottom section */}
            <div className="px-6 py-6 border-t border-gray-200 space-y-2">
              <Link
                href={`/profile/${user.id}`}
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-3 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profilim</span>
              </Link>
              <button
                onClick={openSettingsModal}
                className="w-full flex items-center space-x-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-3 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Ayarlar</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  // Add logout logic here - you can import a logout action
                  // signOut();
                }}
                className="w-full flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-3 rounded-lg font-medium transition-colors mt-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        userEmail={user.email}
      />
    </>
  );
}
